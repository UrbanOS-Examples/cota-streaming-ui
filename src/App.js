import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DataTable from './components/data-table.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {tableData: "didnt change"};
  }

  componentDidMount() {
    var websocket = new WebSocket('ws://localhost:8080');
    websocket.addEventListener('open', function open() {});

    websocket.addEventListener('message', (data, flags) => 
  {
    this.setState({tableData: "hello"});
  });
    console.log('got called once')
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React EXCEPT FOR COOL PEOPLE</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <DataTable tableData={this.state.tableData} />
      </div>
    );
  }
}

export default App;
