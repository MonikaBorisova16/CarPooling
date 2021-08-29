import React from 'react'
import axios from 'axios'
import '../styles/manage.css'
import Select from 'react-select'
import PassengerRow from './TableComponents/PassengerRow'
import { Link } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import MySnackbar from './MySnackBar'
import "../styles/table.css"
import Modal from 'react-modal'
import { TripStatus } from './TableComponents/TableRows'


const customStyles = {
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'white' : 'black',
        backgroundColor: state.isSelected ? '#0a91ca' : 'white',
        '&:hover': {
            backgroundColor: "#a8dcf3",
            color: "black",
            cursor: "pointer"
        }
    }),

    control: (provided) => ({
        ...provided,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: "0",
        border: "1px solid #07aff7",
        fontWeight: "lighter",
        margin: "1.5% 0 2px 2%",
        '&:hover': {
            cursor: "pointer"
        }
    })
}

class ManageTrip extends React.Component {
    constructor(props) {
        super(props)
        this.state =
        {
            trip: {},
            passengers: [],
            statusOptions: [{ value: "ONGOING", label: "Ongoing" },
            { value: "DONE", label: "Done" }, { value: "CANCELED", label: "Cancelled" }],
            passengerStatusOptions: [{ value: "PENDING", label: "Pending" }, { value: "ACCEPTED", label: "Accepted" },
            { value: "REJECTED", label: "Rejected" }, { value: "CANCELED", label: "Canceled" }, { value: "ABSENT", label: "Absent" }],
            newStatus: "",
            statusFilter: "",
            hasMore: false,
            currentPage: -1,
        }

        this.getTrip = this.getTrip.bind(this)
        this.getPassengers = this.getPassengers.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleStatusChange = this.handleStatusChange.bind(this)
        this.handleFilter = this.handleFilter.bind(this)
        this.changePassengerStatus = this.changePassengerStatus.bind(this)
        this.filterPassengers = this.filterPassengers.bind(this)
    }

    componentDidMount() {
        this.getTrip()
    }

    handleSelect = selectedOption => {
        this.setState({
            newStatus: selectedOption === null ? "" : selectedOption.value
        })
    };

    handleFilter = selectedOption => {
        this.setState({
            statusFilter: selectedOption === null ? "" : selectedOption.value
        }, this.filterPassengers)
    }

    filterPassengers() {
        let self = this
        self.setState({
            currentPage: -1,
            passengers: [],
            hasMore: false
        }, this.getPassengers)
    }

    handleStatusChange() {
        const id = this.state.trip._id;
        const { newStatus } = this.state
        let status = ""
        if (newStatus === "AVAILABLE") {
            status = TripStatus.AVAILABLE.toString()
        } else if (newStatus === "BOOKED") {
            status = TripStatus.BOOKED.toString()
        } else if (newStatus === "ONGOING") {
            status = TripStatus.ONGOING.toString()
        } else if (newStatus === "DONE") {
            status = TripStatus.DONE.toString()
        } else if (newStatus === "CANCELED") {
            status = TripStatus.CANCELED.toString()
        }

        axios.patch(`http://localhost:8080/api/trips/status/${id}`, { status }, this.props.header)
            .then(() => this.getTrip())
            .catch(error => alert(error.message))
    }

    getTrip() {
        const self = this;
        const tripID = this.props.match.params.tripid
        axios.get(`http://localhost:8080/api/trips/${tripID}`)
            .then(response => {
                self.setState({
                    trip: response.data
                }, this.getPassengers)
            })
    }

    getPassengers() {
        const tripID = this.props.match.params.tripid
        const { currentPage, statusFilter } = this.state
        const page = currentPage + 1
        axios.get(`http://localhost:8080/api/trips/${tripID}/passengers`)
            .then(response => {
                this.setState({
                    passengers: response.data,
                    hasMore: !response.data.last,
                    currentPage: page
                })
            })
    }

    changePassengerStatus(id, status) {
        const tripID = this.props.match.params.tripid
        axios.patch(`http://localhost:8080/api/trips/${tripID}/passengers/${id}?status=${status}`)
            .then(() => {
                this.setState({
                    passengers: [],
                    currentPage: -1,
                    hasMore: false
                }, this.getTrip)
            })
            .catch(error => this.props.toggleSnackBar(error.response.data.message))
    }

    render() {

        let status = ""
        if (this.state.trip.status === TripStatus.AVAILABLE) {
            status = "AVAILABLE"
        } else if (this.state.trip.status === TripStatus.BOOKED) {
            status = "BOOKED"
        } else if (this.state.trip.status === TripStatus.ONGOING) {
            status = "ONGOING"
        } else if (this.state.trip.status === TripStatus.DONE) {
            status = "DONE"
        } else if (this.state.trip.status === TripStatus.CANCELED) {
            status = "CANCELED"
        }

        return (
            <div className="App">
                <div className="App__Aside-Left"></div>
                <div className="App__Aside">
                    <MySnackbar open={this.props.open} message={this.props.message} handleClose={this.props.handleClose} />
                    <div className="createForm">
                        <div className="header"><h3>Manage trip</h3></div>
                        <div className="manageStatus">
                            <div className="current">
                                <h3>Current status</h3>
                                <h1>{status}</h1>
                            </div>
                            <div className="changeStatus">
                                <Select
                                    options={this.state.statusOptions}
                                    isClearable={true}
                                    onChange={this.handleSelect}
                                    styles={customStyles}
                                    placeholder="Choose new status" />
                                <button className="change" onClick={this.handleStatusChange}>Change status</button>
                            </div>
                            <div className="locationInfo">
                                <h3>from</h3>
                                <h1>{this.state.trip.origin}</h1>
                                <h3>to</h3>
                                <h1>{this.state.trip.destination}</h1>
                            </div>
                        </div>
                        <div className="bottom visible-scroll">
                            <InfiniteScroll
                                className="visible-scroll"
                                dataLength={this.state.passengers.length}
                                next={this.getPassengers}
                                hasMore={this.state.hasMore}
                                loader={<h3>Loading..</h3>}
                                height={430}
                            >
                                <table>
                                    <tbody>
                                        <tr className="fixed">
                                            <th>Username</th>
                                            <th>
                                                Fullname
                                </th>
                                            <th>
                                                <Select
                                                    options={this.state.passengerStatusOptions}
                                                    isClearable={true}
                                                    onChange={this.handleFilter}
                                                    placeholder="Filter by status" />
                                            </th>
                                            <th></th>
                                            <th></th>
                                        </tr>

                                        {this.state.passengers.length !== 0 ? this.state.passengers.map(p => (
                                            <PassengerRow key={p.id} passenger={p} tripStatus={this.state.trip.status}
                                                changeStatus={this.changePassengerStatus} openModal={this.openModal} header={this.props.header} />
                                        )) : <tr><td><h2 className="nothing">No passengers to show</h2></td></tr>}
                                    </tbody>
                                </table>
                            </InfiniteScroll>

                        </div>
                        <Link to={`/trips/${this.state.trip._id}`}><button className="back">Back to trip</button></Link>
                    </div>
                </div>
            </div>
        )
    }
}

Modal.setAppElement("#root")
const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '20%',
        height: '40%',
        padding: '3% 0',
        textAlign: 'center',
    }
}

export default ManageTrip