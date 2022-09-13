import logo from "./logo.svg";
import "./App.css";
import React from "react";

////////////////////

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return <div> The time is {this.state.date.toLocaleTimeString()} </div>;
  }
}

////////////////////
// This component makes a REST call to the backend and lists the retrieved TODO's

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { todos: [] };
 }

  componentDidMount() {
      fetch("/todos")
        .then((res) => res.json())
        .then((data) => {
          this.setState({ todos: data.todos })
        })
        .catch(console.log);
  }
 
  render() {
    return (
      <div>
        <p> You have {this.state.todos.length} TODOs: </p>
        <ul>
          {this.state.todos.map(function(name){
            return <li>{name}</li>;
          })}
        </ul>
      </div>
    );
  }
}

////////////////////
// This component let's the user add a TODO that is submitted to the backend via a REST call

class TodoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) { 
    this.setState({value: event.target.value});
  }

  async handleSubmit(event) {
    event.preventDefault();
    try {
      let body = JSON.stringify({
        todo: this.state.value,
      });
      console.log("before post /todo with body", body);
      let res = await fetch("/todo", {
        method: "POST",
        body: body,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      console.log("post todo |->", res);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          New TODO:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="ADD" />
      </form>
    );
  }
}

////////////////////

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p> Todo App </p>
        <p>
          <Clock />
          <TodoList />
          <TodoForm />
        </p>
      </header>
    </div>
  );
}

export default App;
