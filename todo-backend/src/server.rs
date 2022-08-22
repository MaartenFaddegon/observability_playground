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

pub mod todobackend {
    tonic::include_proto!("todobackend");
}

#[derive(Debug)]
pub struct MyTodoBackend {
  db_sender: mpsc::Sender<String>
}

#[tonic::async_trait]
impl TodoBackend for MyTodoBackend {
    async fn add_rpc(
        &self,
        request: Request<AddRequest>,
    ) -> Result<Response<AddResponse>, Status> {
      println!("Got an ADD-request: {:?}", request);
      self.db_sender.send(request.into_inner().item).await;
      let reply = todobackend::AddResponse {
        idx: 42,
      };
      Ok(Response::new(reply))
  }

  async fn get_rpc(
      &self,
      request: Request<GetRequest>,
  ) -> Result<Response<GetResponse>, Status> {
    println!("Got a GET-request: {:?}", request);
    let reply = todobackend::GetResponse {
      items: Vec::new(),
    };
    Ok(Response::new(reply))
  }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let (tx, mut rx) = mpsc::channel(32);
    let db_task = tokio::spawn(async move {
      while let Some(s) = rx.recv().await {
        println!("DB GOT {:?}", s);
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
