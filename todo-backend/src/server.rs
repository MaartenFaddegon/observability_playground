use tonic::{transport::Server, Request, Response, Status};
use tokio::sync::mpsc;
use tokio::sync::oneshot;

use todobackend::{
  AddRequest, 
  AddResponse,
  GetRequest, 
  GetResponse,
  Res,
  todo_backend_server::{
    TodoBackendServer, 
    TodoBackend
  }
};

#[derive(Debug)]
enum Command {
  Add {
    item: String,
  },
  Get {
    resp: oneshot::Sender<Vec<String>>,
  },
}

pub mod todobackend {
    tonic::include_proto!("todobackend");
}

#[derive(Debug)]
pub struct MyTodoBackend {
  db_sender: mpsc::Sender<Command>
}

#[tonic::async_trait]
impl TodoBackend for MyTodoBackend {
    async fn add_rpc(
        &self,
        request: Request<AddRequest>,
    ) -> Result<Response<AddResponse>, Status> {
      let cmd = Command::Add{item: request.into_inner().item};
      let res = match self.db_sender.send(cmd).await {
        Ok(_) => {
          Res::Ok
        }
        Err(e) => {
          println!("DB.add failed: {:?}", e);
          Res::Err
        }
      };
      let reply = todobackend::AddResponse {
        res: res.into(),
      };
      Ok(Response::new(reply))
  }

  async fn get_rpc(
      &self,
      _request: Request<GetRequest>,
  ) -> Result<Response<GetResponse>, Status> {
    let (resp_tx, resp_rx) = oneshot::channel::<Vec<String>>();
    let cmd = Command::Get{
      resp: resp_tx,
    };
    match self.db_sender.send(cmd).await {
        Err(e) => {
          println!("DB.get failed in step 1: {:?}", e);
        }
        _ => (),
    };
    let maybe_res = resp_rx.await;
    let items = match maybe_res {
      Ok(i) => {
        i
      }
      Err(error) => {
        println!("DB.get failed in step 2: {:?}", error);
        Vec::new()
      }
    };
    let reply = todobackend::GetResponse{items};
    Ok(Response::new(reply))
  }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let (tx, mut rx) = mpsc::channel(32);
    let _db_task = tokio::spawn(async move {
      let mut todos = Vec::new();
      while let Some(cmd) = rx.recv().await {
        match cmd {
	  Command::Add{item: i} => {
            println!("DB-ADD {:?}", i);
	    todos.push(i)
	  }
	  Command::Get{resp} => {
            println!("DB-GET {:?}", todos);
	    match resp.send(todos.clone()) {
              Err(e) => println!("DB-get failed sending todos: {:?}", e),
              _ => ()
            };
	  }
        }
      }
    });

    let addr = "[::1]:8080".parse()?;
    let backend = MyTodoBackend{
      db_sender: tx
    };
    Server::builder()
        .add_service(TodoBackendServer::new(backend))
        .serve(addr)
        .await?;
    Ok(())
}
