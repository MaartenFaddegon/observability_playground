import logo from './logo.svg';
import './App.css';
import React from 'react';


class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div> The time is {this.state.date.toLocaleTimeString()} </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p> Todo App </p>
        <p>
          <Clock /> 
          and you have ?? TODOs
        </p>
      </header>
    </div>
  );
}

export default App;
