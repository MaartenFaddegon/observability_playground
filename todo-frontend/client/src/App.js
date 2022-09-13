import logo from "./logo.svg";
import "./App.css";
import React from "react";

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


function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/todos")
      .then((res) => res.json())
      .then((data) => setData(data.todos));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p> Todo App </p>
        <p>
          <Clock />
          <TodoList />
        </p>
      </header>
    </div>
  );
}

export default App;
