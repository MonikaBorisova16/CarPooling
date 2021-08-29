import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

const PassengerStatus = {
    PENDING: "PENDING", ACCEPTED: "ACCEPTED", REJECTED: "REJECTED", CANCELED: "CANCELED", ABSENT: "ABSENT"
}

class PassengerRow extends React.Component {
    constructor(props) {
        super(props)
        this.state =
        {
            passenger: {},
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:8080/api/users/getID/${this.props.passenger.id}`, this.props.header)
            .then(response => {
                this.setState({
                    passenger: response.data
                })
            });
    }

    render() {

        let status = ""
        if (this.props.passenger.status === 0) {
            status = PassengerStatus.PENDING
        } else if (this.props.passenger.status === 1) {
            status = PassengerStatus.ACCEPTED
        } else if (this.props.passenger.status === 2) {
            status = PassengerStatus.REJECTED
        } else if (this.props.passenger.status === 3) {
            status = PassengerStatus.CANCELED
        } else if (this.props.passenger.status === 4) {
            status = PassengerStatus.ABSENT
        }

        const doneButtons = status === "ACCEPTED" || status === "ABSENT" ?
            <td><button onClick={() => this.props.openModal(this.state.passenger.id)} className="accept">Rate</button>
                <button onClick={() => this.props.changeStatus(this.state.passenger.id, "ABSENT")} className="decline">Absent</button></td>
            :
            null

        const actionButtons = this.props.tripStatus === "AVAILABLE" || this.props.tripStatus === "BOOKED" ?
            <td><button onClick={() => this.props.changeStatus(this.state.passenger.id, "ACCEPTED")} className="accept">Accept</button>
                <button onClick={() => this.props.changeStatus(this.state.passenger.id, "REJECTED")} className="decline">Reject</button></td>
            :
            <Fragment>{doneButtons}</Fragment>

        return (
            <tr className="pRow">
                <td>{this.state.passenger.username}</td>
                <td>{this.state.passenger.firstName} {this.state.passenger.lastName}</td>
                <td>{status}</td>
                <td><Link to={`/profile/${this.state.passenger.username}`}><button className="viewProfile">View profile</button></Link></td>
                {actionButtons}
            </tr>
        )
    }
}
export default PassengerRow;