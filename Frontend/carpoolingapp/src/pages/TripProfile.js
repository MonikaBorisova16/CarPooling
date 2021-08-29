import React from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom'
import "../styles/tripProfile.css"
import TripInfo from './TripInfo'
import Comment from './Comment'
import moment from 'moment'
import Modal from 'react-modal'
import InfiniteScroll from 'react-infinite-scroll-component'
import MySnackbar from '../pages/MySnackBar'
import { TripStatus } from './TableComponents/TableRows'

class TripProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state =
        {
            tripData: {},
            driver: {},
            carID: "",
            car: {},
            avatarURL: "https://img.huffingtonpost.com/asset/5bb4d7b62600003001827984.jpeg?ops=scalefit_720_noupscale",
            comment: "",
            hasMore: false,
            currentPage: -1,
            comments: [],
            amIPassenger: false,
            userStatus: "",
            modal: false,
        }

        this.getTrip = this.getTrip.bind(this)
        this.getCar = this.getCar.bind(this)
        this.addComment = this.addComment.bind(this)
        this.getComments = this.getComments.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.applyForTrip = this.applyForTrip.bind(this)
        this.amIPassenger = this.amIPassenger.bind(this)
        this.leaveTrip = this.leaveTrip.bind(this)
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    componentDidMount() {
        this.getTrip()
        this.getComments()
        this.amIPassenger()
    }

    openModal() {
        this.setState({ modal: true });
    }

    getTrip() {
        const id = this.props.match.params.tripid
        axios.get(`http://localhost:8080/api/trips/${id}`)
            .then(response => {
                this.setState({
                    tripData: response.data,
                    driver: { id: response.data.driverID, firstName: response.data.driverFirstName, lastName: response.data.driverLastName, username: response.data.driverUsername },
                    carID: response.data.carID
                }, () => this.getCar())
            })
    }

    getCar() {
        const id = this.state.carID
        axios.get(`http://localhost:8080/api/cars/get/${id}`)
            .then(response => {
                this.setState({
                    car: response.data
                })
            })
    }

    amIPassenger() {
        const id = this.props.match.params.tripid
        axios.get(`http://localhost:8080/api/trips/${id}/amIPassenger`, this.props.header)
            .then(response => {
                this.setState({
                    amIPassenger: response.data.amIPassenger,
                    userStatus: response.data.status
                })
            })
    }

    getComments() {
        const { currentPage } = this.state
        const page = currentPage + 1
        const id = this.props.match.params.tripid
        axios.get(`http://localhost:8080/api/trips/${id}/comments`)
            .then(response => {
                this.setState({
                    comments: response.data !== ""? response.data:[],
                    currentPage: page,
                    hasMore: !response.data.last
                })
            })
    }

    leaveTrip() {
        const id = this.props.match.params.tripid
        const myId = this.props.loggedID
        axios.patch(`http://localhost:8080/api/trips/${id}/passengers/${myId}?status=CANCELED`)
            .then(response => {
                this.setState({
                    amIPassenger: false,
                    userStatus: "None"
                })
            })
            .catch(error => this.props.toggleSnackBar(error.response.data.message))
    }

    addComment() {
        const id = this.props.match.params.tripid
        const data =
        {
            message: this.state.comment
        }

        axios.post(`http://localhost:8080/api/trips/${id}/comments`, data, this.props.header)
            .then(() => {
                this.setState({
                    hasMore: false,
                    currentPage: -1,
                    comments: []
                }, this.getComments)
            })
    }

    applyForTrip() {
        const id = this.props.match.params.tripid
        axios.post(`http://localhost:8080/api/trips/${id}/passengers`,this.props.header)
            .then(response => {
                this.setState({
                    amIPassenger: true,
                    userStatus: "Pending"
                })
            })
            .catch(error => this.props.toggleSnackBar(error.message))
    }

    closeModal() {
        this.setState({ modal: false });
    }

    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
            [name]: value
        });

    }

    render() {
        const loggedID = this.props.loggedID
        const userStatus = loggedID === this.state.driver.id ? "Driver" :
            this.state.amIPassenger ? this.state.userStatus : "None"
        const date = moment(this.state.tripData.departureTime, 'DD/MM/YYYY')
        const month = date.format("MMMM")
        const day = date.format("Do")
        const time = date.format("HH:mm")
        const tripEnded = this.state.tripData.status === "DONE" && this.state.amIPassenger && this.state.userStatus === "ACCEPTED" ? false : true
        let { origin, destination, message, status } = this.state.tripData

        if (status === TripStatus.AVAILABLE) {
            status = "AVAILABLE"
        } else if (status === TripStatus.BOOKED) {
            status = "BOOKED"
        } else if (status === TripStatus.ONGOING) {
            status = "ONGOING"
        } else if (status === TripStatus.DONE) {
            status = "DONE"
        } else if (status === TripStatus.CANCELED) {
            status = "CANCELED"
        }

        const isMyTrip = this.props.loggedID === this.state.driver.id
        const tripID = this.state.tripData._id
        const leftButton = isMyTrip ? <Link to={`/trips/${tripID}/edit`}><button className="leftButton">Edit trip</button></Link> :
            (this.state.amIPassenger ? <button className="leftButton" onClick={this.leaveTrip}>Leave trip</button> : <button className="leftButton" onClick={this.applyForTrip}>Apply for trip</button>)
        const rightButton = isMyTrip ? <Link to={`/trips/${tripID}/manage`}><button className="rightButton">Manage</button></Link> : ""
        return (
            <div className="App">
                <div className="App__Aside-Left"></div>
                <div className="App__Aside">
                    <MySnackbar open={this.props.open} message={this.props.message} handleClose={this.props.handleClose} />
                    <div className="createForm">
                        <div className="header"><h3>Trip profile</h3></div>
                        <div className="top">

                            <div className="date">
                                <div className="month">{month}</div>
                                <div className="day">{day}</div>
                                <div className="time">{time}</div>
                            </div>
                            <div className="locations">
                                <h4>from</h4>
                                <h2>{origin}</h2>
                                <h4>to</h4>
                                <h2>{destination}</h2>
                            </div>

                            <div className="tripStatus">
                                <h4>Trip status</h4>
                                <h2>{status}</h2>
                            </div>

                            <div className="driver">
                                <h5>Your driver:</h5>
                                <h4>{this.state.driver.firstName} {this.state.driver.lastName} </h4>
                                <Link to={`/profile/${this.state.driver.username}`}><button className="profileButton">View profile</button></Link>

                            </div>
                        </div>
                        <div className="bottom">
                            <TripInfo car={this.state.car} tripData={this.state.tripData} />
                            <div className="bottom-right">
                                <div className="right-top">
                                    <div className="message">
                                        <h3>Message </h3>
                                        <p>{message}</p>
                                    </div>
                                    <div className="status">
                                        <h3>Your status</h3>
                                        <h1>{userStatus}</h1>
                                    </div>
                                </div>
                                <div className="right-bottom">
                                    <h2 className="commentHeading">Comments</h2>
                                    <div className="comments">
                                        <InfiniteScroll
                                            dataLength={this.state.comments.length}
                                            next={this.getComments}
                                            hasMore={this.state.hasMore}
                                            loader={<h3>Loading..</h3>}
                                            height={190}
                                            scrollThreshold={0.95}
                                        >
                                            {this.state.comments.length !== 0 ?
                                                this.state.comments.map(comment => (
                                                    <Comment key={comment._id} comment={comment} header={this.props.header}/>
                                                )) : <h5 className="noComments">No comments to show</h5>}
                                        </InfiniteScroll>
                                    </div>
                                    <div className="addComment">
                                        <textarea maxLength="150" name="comment" onChange={this.handleChange} value={this.state.comment}>

                                        </textarea>
                                        <button className="sendComment" onClick={this.addComment}>Send</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {leftButton}
                        {rightButton}
                    </div>

                    <Modal
                        isOpen={this.state.modal}
                        onRequestClose={this.closeModal}
                        shouldCloseOnEsc={true}
                        shouldCloseOnOverlayClick={true}
                        contentLabel="Example Modal"
                        style={customStyles}
                    >
                    </Modal>

                </div>
            </div>
        )
    }
}

Modal.setAppElement("#root")
const customStyles = {
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
};

// const selectStyles = {
//     option: (provided, state) => ({
//         ...provided,
//         color: state.isSelected ? 'white' : 'black',
//         backgroundColor: state.isSelected ? '#0a91ca' : 'white',
//         '&:hover': {
//             backgroundColor: "#a8dcf3",
//             color: "black",
//             cursor: "pointer"
//         }
//     }),

//     control: (provided) => ({
//         ...provided,
//         width: "80%",
//         border: "2px solid #0a91ca",
//         marginLeft: "auto",
//         marginRight: "auto",
//         marginBottom: "4%",
//         '&:hover': {
//             border: "2px solid #055b80",
//             cursor: "pointer"
//         }
//     })
// }


export default TripProfile
