import React from 'react'
import "../styles/App.css"
import "../styles/forms.css"
import "../styles/profile.css"
import "../styles/table.css"
import TableRows from './TableComponents/TableRows'
import InfiniteScroll from 'react-infinite-scroll-component'
import DefaultAvatar from '../images/defaultavatar.png'
import axios from 'axios';
import Select from 'react-select'
import { Link } from 'react-router-dom'

class UserProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state =
        {
            shallIUpdate: false,
            userDetails: {},
            trips: [],
            hasMore: false,
            currentPage: -1,
            destinationCriteria: "",
            originCriteria: "",
            statusCriteria: "",
            avatarURL: DefaultAvatar,
            statusOptions: [{ value: "AVAILABLE", label: "Available" }, { value: "BOOKED", label: "Booked" }, { value: "ONGOING", label: "Ongoing" },
            { value: "DONE", label: "Done" }, { value: "CANCELED", label: "Cancelled" }]

        }
        // this.validateAndGetAvatar = this.validateAndGetAvatar.bind(this)
        this.getTrips = this.getTrips.bind(this)
    }

    componentDidMount() {
        const username = this.props.match.params.username;
        this.getProfile(username)
        this.getTrips(username)
    }

    getProfile(username) {
        // if(this.state.userDetails === undefined){
        axios.get(`http://localhost:8080/api/users/get/${username}`, this.props.header)
            .then(response => {
                this.setState({
                    userDetails: response.data,
                    shallIUpdate: false,
                }, this.validateAndGetAvatar)
            })
        // }
    }

    filterTrips() {
        let self = this
        self.setState({
            currentPage: -1,
            trips: [],
            hasMore: false
        }, this.getTrips(this.props.match.params.username)
        )
    }

    handleOriginChange = selectedOption => {
        this.setState({
            originCriteria: selectedOption === null ? "" : selectedOption.value
        })
        this.filterTrips()
    };

    handleDestinationChange = selectedOption => {
        this.setState({
            destinationCriteria: selectedOption === null ? "" : selectedOption.value
        })
        this.filterTrips()
    };

    handleStatusChange = selectedOption => {
        this.setState({
            statusCriteria: selectedOption === null ? "" : selectedOption.value
        })
        this.filterTrips()
    };

    getTrips(username) {
        const self = this
        const { originCriteria, destinationCriteria, statusCriteria } = this.state
        const page = this.state.currentPage
        axios.get(`http://localhost:8080/api/trips/user/${username}`, this.props.header)
            .then(response => {
                self.setState({
                    trips: response.data,
                    hasMore: false,
                    currentPage: page
                })
            })
    }

    static getDerivedStateFromProps(props, state) {
        if (props.match.params.username !== state.userDetails.username && state.userDetails.username !== undefined) {
            return {
                // shallIUpdate: true,
                trips: [],
                currentPage: -1,
                hasMore: false
            }
        }
        else return null
    }

    componentDidUpdate() {
        if (this.state.shallIUpdate) {
            this.getProfile(this.props.match.params.username)
            this.getTrips(this.props.match.params.username)
            this.validateAndGetAvatar()
        }
    }

    validateAndGetAvatar() {
        axios.get(this.state.userDetails.avatarUri)
            .then(response => {
                this.setState({
                    avatarURL: this.state.userDetails.avatarUri
                })
            })
    }

    render() {
        const isMyProfile = this.props.loggedUsername === this.props.match.params.username
        const editButton = isMyProfile ? <Link to={`/profile/${this.props.match.params.username}/edit`}><button className="bottomButton">Edit Profile</button></Link> : null
        return (
            <div className="App">
                <div className="App__Aside-Left"></div>
                <div className="App__Aside">
                    <div className="createForm">
                        <div className="header"><h3>User profile</h3></div>
                        <div className="top">
                            <div className="profile-picture-container">
                                <img className="profile-picture" src={this.state.avatarURL} alt="profile"></img>
                            </div>
                            <div className="information">
                                <h5>fullname</h5>
                                <h3>{this.state.userDetails.firstName} {this.state.userDetails.lastName}</h3>
                                <h5>username</h5>
                                <h3>{this.state.userDetails.username}</h3>
                                <h5>phone</h5>
                                <h3>{this.state.userDetails.phone}</h3>
                                <h5>e-mail</h5>
                                <h3>{this.state.userDetails.email}</h3>

                            </div>
                        </div>
                        <div className="bottom visible-scroll">
                            <InfiniteScroll
                                className="visible-scroll"
                                dataLength={this.state.trips.length}
                                next={this.state.trips}
                                hasMore={false}
                                loader={<h3>Loading..</h3>}
                                height={370}
                            >
                                <table>
                                    <tbody>
                                        <tr className="fixed">
                                            <th>When</th>
                                            <th>
                                                <Select
                                                    options={this.state.availableLocations}
                                                    onChange={this.handleOriginChange}
                                                    isClearable={true}
                                                    placeholder="Filter by origin" />
                                            </th>
                                            <th>
                                                <Select
                                                    options={this.state.availableLocations}
                                                    onChange={this.handleDestinationChange}
                                                    isClearable={true}
                                                    placeholder="Filter by destination" />
                                            </th>
                                            <th>
                                                <Select
                                                    options={this.state.statusOptions}
                                                    isClearable={true}
                                                    onChange={this.handleStatusChange}
                                                    placeholder="Filter by status" />
                                            </th>
                                            <th>Passengers</th>
                                            <th></th>
                                        </tr>

                                        {this.state.trips.length !== 0 ? this.state.trips.map(trip => (
                                            <TableRows key={trip._id} tripData={trip} />
                                        )) : <tr><td><h5 className="nothing">No trips to show</h5></td></tr>}
                                    </tbody>
                                </table>
                            </InfiniteScroll>

                        </div>
                        {editButton}
                    </div>
                </div>

            </div>
        )

    }
}



export default UserProfile;
