import React from "react";


// material-ui
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from "@material-ui/core/TextField";
import axios from "axios";

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            error: false,
            message: "",
            data: {}
        }
    }

    componentDidMount() {
        let token = localStorage.getItem("token")
        axios.get(window.API_URL + "/api/users", {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then(res => {
                this.setState({
                    data: res.data
                })
            })
            .catch(err => {
                if (err.response) {
                    this.setState({
                        error: true,
                        message: err.response.data.message
                    })
                } else {
                    this.setState({
                        error: true,
                        message: err.message,
                    })
                }
            })
    }

    render() {

        console.log(this.state.data);
        return (
            this.state.data.users ?
                <div>
                    <TextField
                        id="name"
                        label="Search"
                        placeholder="Search for an user"
                        value={this.state.query}
                        onChange={e => this.setState({query: e.target.value.toLowerCase()})}
                        margin="normal"
                    />


                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {Object.keys(this.state.data.users[0]).map((key, i) => {
                                        return <TableCell key={i}>{key}</TableCell>
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.data.users.filter(user => user.name ? Object.values(user).some(el => el.toLowerCase().includes(this.state.query)) : false).map(user => {
                                    return (
                                        <TableRow key={user._id}>
                                            {Object.values(user).map((val, i) => {
                                                return <TableCell key={i}>{val}</TableCell>
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
                :
                <div>
                    <h3>{this.state.error ? this.state.message : "Something went wrong"}</h3>
                </div>
        )
    }
}

export default Users;