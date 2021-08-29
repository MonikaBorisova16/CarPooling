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
import { NavLink } from 'react-router-dom';
import TripsTableRows from "./TripsTableRows";

class TripsTable extends React.Component {
    constructor(props) {
        super(props)
        this.state =
        {
            trips: [],
            smokingCriteria: "",
            petsCriteria: "",
            luggageCriteria: "",
            originCriteria: "",
            destinationCriteria: "",
            statusCriteria: "",
            timeCriteria: "",
            driverCriteria: "",
            shallUpdate: false,
            currentPage: -1,
            tableType: "trips",
            hasMore: true
        }

        this.deleteTrip = this.deleteTrip.bind(this)
        this.getTrips = this.getTrips.bind(this)
    }

    componentDidMount() {
        this.getTrips()
    }

    getTrips() {

        const { currentPage, driverCriteria, statusCriteria, destinationCriteria, originCriteria, smokingCriteria, luggageCriteria, petsCriteria, timeCriteria } = this.state
        let self = this;
        let page = currentPage + 1
        const BASE_URL = "http://localhost:8080/api/trips"
        // const URL = `${BASE_URL}?page=${page}&size=8&driver=${driverCriteria}&origin=${originCriteria}&destination=${destinationCriteria}&status=${statusCriteria}&allows_pets=${petsCriteria}&allows_luggage=${luggageCriteria}&allows_smoking=${smokingCriteria}&earliest=${timeCriteria}`
        axios.get(BASE_URL)
            .then(function (response) {
                self.setState({
                    trips: response.data,
                    hasMore: false,
                    currentPage: page
                })
            })
    }

    deleteTrip(tripID) {
        let self = this;
        axios.delete(`http://localhost:8080/api/trips/${tripID}`, this.props.header)
            .then(() => {
                self.setState({
                    trips: [],
                    hasMore: false,
                    currentPage: -1
                }, self.getTrips)
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
                            dataLength={this.state.trips.length}
                            next={this.getTrips}
                            hasMore={this.state.hasMore}
                            loader={<div className="loader" key={0}>Loading ...</div>}
                            height={580}
                        >
                            <Table className="root">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Driver</TableCell>
                                        <TableCell align="center">From</TableCell>
                                        <TableCell align="center">To</TableCell>
                                        <TableCell align="center">Date</TableCell>
                                        <TableCell align="center">Info</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {this.state.trips.map(trip =>
                                        <TripsTableRows key={trip._id} tripData={trip} delete={this.deleteTrip} />
                                    )}

                                </TableBody>
                            </Table>
                        </InfiniteScroll>
                    </Paper>
                </div>
            </div>
        );
    }
}
export default TripsTable