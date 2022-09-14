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
  render() {
    return (
      <div>
        <p> You have {this.props.todos.length} TODOs: </p>
        <ul>
          {this.props.todos.map(function (name) {
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
    this.state = { value: "", todos: [] };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.fetch_todos();
  }

  fetch_todos() {
    fetch("/todos")
      .then((res) => res.json())
      .then((data) => {
        this.setState({ todos: data.todos });
      })
      .catch(console.log);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
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
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      console.log("post todo |->", res);
      console.log("status = ", res.status);
      if (res.status === 200) {
        console.log("clear value");
        this.setState({ value: "" });
        this.fetch_todos();
      }
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div>
        <TodoList todos={this.state.todos} />
        <form onSubmit={this.handleSubmit}>
          <label>
            New TODO:
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="ADD" />
        </form>
      </div>
    );
  }
}

////////////////////

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1> Todo App </h1>
        <p>
          <Clock />
          <TodoForm />
        </p>
      </header>
    </div>
  );
}

export default App;
