use std::io::stdin;

use tonic::transport::Channel;

use todobackend::{
  AddRequest, 
  AddResponse,
  GetRequest, 
  GetResponse,
  todo_backend_client::TodoBackendClient
};

pub mod todobackend {
  tonic::include_proto!("todobackend");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
  let mut client = TodoBackendClient::connect("http://[::1]:8080").await?;
  loop {
    // list todos
    let request = tonic::Request::new(GetRequest{});
    let response = client.get_rpc(request).await?;
    let items = response.into_inner().items;
    println!("You have {} TODOs", items.len());
    for item in items.iter() {
      println!(" - {}", item);
    }
    // user input
    println!("(q)uit / (a)dd todo-item / (r)efresh todo list");
    let mut cmd: String = String::new();
    stdin().read_line(&mut cmd).unwrap();
    match cmd.trim().to_lowercase().chars().next().unwrap() {
      'q' =>
        break,
      'a' => {
        println!("enter description:");
        let mut description: String = String::new();
        stdin().read_line(&mut description).unwrap();
        let addreq = tonic::Request::new(AddRequest{
          item: description,
        });
        let response = client.add_rpc(addreq).await?;
      }
      'r' =>
        println!("GET"),
      _ => println!("Invalid input :("),
    }
  };
  Ok(())
}
