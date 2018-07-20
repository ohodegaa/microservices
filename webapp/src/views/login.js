import React from "react";
import axios from "axios";


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        }
    }

    componentDidMount() {
        let token = localStorage.getItem("token");
        if (token) {
            axios.get(window.AUTH_URL + "/auth/me", {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
                .then(res => {
                    if (res.data.auth) {

                        this.props.loggedIn();
                    }
                })
                .catch(err => {
                    console.log("Error!!!: " + err);
                })
        }


    }

    login = (e) => {
        e.preventDefault();

        axios.post(window.AUTH_URL + "/auth/login",
            {
                username: this.state.username,
                password: this.state.password,
            }
        )
            .then(res => {
                let data = res.data;
                if (data.auth) {
                    localStorage.setItem("token", data.token);
                } else {
                    this.setState({
                        error: true,
                        message: data.message ? data.message : "User not authorized",
                    })
                }
            })
            .catch(err => {
                console.log("Error: " + err);
            })
    }

    render() {
        return (
            <div>
                <h1>{this.state.error ? this.state.message : "please log in!"}</h1>
                <form onSubmit={this.login}>
                    <input type="text" onChange={(e) => this.setState({username: e.target.value})}/>
                    <input type="password" onChange={(e) => this.setState({password: e.target.value})}/>
                    <input type="submit"/>
                </form>
            </div>
        )

    }
}

export default Login;