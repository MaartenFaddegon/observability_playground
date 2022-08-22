use tonic::{transport::Server, Request, Response, Status};
use tokio::sync::mpsc;

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
      request: Request<GetRequest>,
  ) -> Result<Response<GetResponse>, Status> {
    let reply = todobackend::GetResponse {
      items: Vec::new(),
    };
    let cmd = Command::Get{};
    self.db_sender.send(cmd).await;
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
	  Command::Get{} => {
            println!("DB-GET");
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
