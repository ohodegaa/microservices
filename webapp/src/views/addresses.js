import React from "react";


// material-ui
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from "@material-ui/core/TextField";

const addressesUrl = "/api/addresses/";

class Addresses extends React.Component {
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
        fetch(addressesUrl, {
            method: "get",
        })
            .then(results => {
                try {
                    console.log(results);
                    return results.json();
                } catch (e) {
                    console.log("error")
                }
            })
            .then(_data => {
                this.setState({
                    data: _data
                })
            })
    }

    render() {
        return (
        this.state.data.headers ?
            <div>
                <TextField
                    id="name"
                    label="Search"
                    placeholder="Search for an address"
                    value={this.state.query}
                    onChange={e => this.setState({query: e.target.value})}
                    margin="normal"
                />



                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {this.state.data.headers.map(key => {
                                        return <TableCell>{key}</TableCell>
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.data.addresses.filter(address => address.ADRESSENAVN ? address.ADRESSENAVN.includes(this.state.query) : false).map(address => {
                                    return (
                                        <TableRow key={address._id}>
                                            {Object.values(address).map(val => {
                                                return <TableCell>{val}</TableCell>
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
                No data available!
            </div>
        )
    }
}

export default Addresses;