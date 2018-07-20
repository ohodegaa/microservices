import React, {Component} from 'react';
import {Switch, Route} from "react-router-dom";
import './App.css';
import Addresses from "./views/addresses";
import Login from "./views/login";
import axios from "axios";
import Users from "./views/users";
import Landing from "./views/landing";

axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

window.LOCATION_URL = window.location.protocol + "//" + window.location.hostname;
window.API_URL = "http://localhost:8080";
window.AUTH_URL = "http://localhost:8080";

class App extends Component {


    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,

        }
    }



    render() {
        return (
            <div className="App">
                <Switch>
                    <Route exact path="/" render={() => this.state.loggedIn ? <Landing/> : <Login loggedIn={() => this.setState({loggedIn: true})}/>}/>
                    <Route exact path="/addresses" component={Addresses}/>
                    <Route exact path="/users" component={Users}/>
                </Switch>
            </div>
        );
    }
}

export default App;
