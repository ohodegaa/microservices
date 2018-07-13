import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import './App.css';
import Addresses from "./views/addresses";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
            <Route exact path="/" render={(props) => <h1>Cool site</h1>} />
            <Route exact path="/addresses" component={Addresses}/>
        </Switch>
      </div>
    );
  }
}

export default App;
