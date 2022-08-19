use tonic::{transport::Server, Request, Response, Status};

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

#[derive(Debug, Default)]
pub struct MyTodoBackend {}

#[tonic::async_trait]
impl TodoBackend for MyTodoBackend {
    async fn add_rpc(
        &self,
        request: Request<AddRequest>,
    ) -> Result<Response<AddResponse>, Status> {
      println!("Got an ADD-request: {:?}", request);
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
    let addr = "[::1]:8080".parse()?;
    let backend = MyTodoBackend::default();
    Server::builder()
        .add_service(TodoBackendServer::new(backend))
        .serve(addr)
        .await?;
    Ok(())
}
