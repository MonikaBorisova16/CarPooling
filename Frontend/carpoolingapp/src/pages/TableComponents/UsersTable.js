import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import "../../styles/leaderBoards.css";
import InfiniteScroll from 'react-infinite-scroll-component'
import { NavLink, Link } from 'react-router-dom';

class UsersTable extends React.Component {
    constructor(props) {
        super(props)
        this.state =
        {
            users: [],
            shallUpdate: false,
            currentPage: -1,
            hasMore: true
        }
        this.getUsers = this.getUsers.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
    }

    componentDidUpdate() {
        if (this.state.shallUpdate) {
            this.getUsers()
        }
    }

    componentDidMount() {
        this.getUsers()
    }

    getUsers() {
        const self = this;
        const page = this.state.currentPage + 1;
        axios.get(`http://localhost:8080/api/users`)
            .then(response => {
                self.setState({
                    users: response.data,
                    shallUpdate: false,
                    hasMore: false,
                    currentPage: page
                })
            })
    }


    deleteUser(userID) {
        let self = this;
        axios.delete(`http://localhost:8080/api/users/${userID}`, this.props.header)
            .then(() => {
                self.setState({
                    users: [],
                    hasMore: false,
                    currentPage: -1
                }, self.getUsers)
            })
    }

    render() {
        return (
            <div className="App">
                <div className="App__Aside-Left"></div>
                <div className="App__Aside">
                    <div className="PageSwitcher pageSwitcher">
                        <NavLink to="/admin/users" activeClassName="PageSwitcher__Item--Active"
                            className="PageSwitcher__Item">Users</NavLink>
                        <NavLink to="/admin/trips" activeClassName="PageSwitcher__Item--Active"
                            className="PageSwitcher__Item">Trips</NavLink>
                    </div>

                    <Paper className="lb table">
                        <InfiniteScroll
                            className="infiniteScroller padding-top"
                            dataLength={this.state.users.length}
                            next={this.getUsers}
                            hasMore={this.state.hasMore}
                            loader={<div className="loader" key={0}>Loading ...</div>}
                            height={580}
                        >
                            <Table className="root">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Username</TableCell>
                                        <TableCell align="center">Info</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {this.state.users.map(user => {
                                        return (
                                            <TableRow key={user._id} height="50px">
                                                <TableCell align="center">{user.username}</TableCell>
                                                <TableCell align="center" className="ratingRow">
                                                    <Link to={`/profile/${user.username}`}><button className="button">View</button></Link>
                                                    <button className="button" onClick={() => this.deleteUser(user._id)}>Delete</button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}

                                </TableBody>
                            </Table>
                        </InfiniteScroll>
                    </Paper>
                </div>
            </div>

        );
    }
}

export default UsersTable
