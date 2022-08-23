use tonic::{transport::Server, Request, Response, Status};
use tokio::sync::mpsc;
use tokio::sync::oneshot;

use todobackend::{
  AddRequest, 
  AddResponse,
  GetRequest, 
  GetResponse,
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
      self.db_sender.send(cmd).await;
      let reply = todobackend::AddResponse {
        idx: 42,
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
    self.db_sender.send(cmd).await;
    let maybe_res = resp_rx.await;
    let items = match maybe_res {
      Ok(i) => {
        i
      }
      Err(error) => {
        println!("Error trying to GET: {:?}", error);
        Vec::new()
      }
    };
    let reply = todobackend::GetResponse {
      items: items,
    };
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
	  Command::Get{resp: resp} => {
            println!("DB-GET {:?}", todos);
	    resp.send(todos.clone());
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
