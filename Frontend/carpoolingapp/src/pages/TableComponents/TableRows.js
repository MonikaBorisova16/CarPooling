import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'

export default function TableRows(props) {
    const tripID = props.tripData._id;
    let date = moment(props.tripData.departureTime, 'DD/MM/YYYY').format("MMMM Do YYYY, HH:mm")
    let status = "";
    let propsStatus = props.tripData.status;

    if (propsStatus === TripStatus.AVAILABLE) {
        status = "AVAILABLE"
    } else if (propsStatus === TripStatus.BOOKED) {
        status = "BOOKED"
    } else if (propsStatus === TripStatus.ONGOING) {
        status = "ONGOING"
    } else if (propsStatus === TripStatus.DONE) {
        status = "DONE"
    } else if (propsStatus === TripStatus.CANCELED) {
        status = "CANCELED"
    }
    return (
        <tr>
            <td>{date}</td>
            <td>{props.tripData.origin}</td>
            <td>{props.tripData.destination}</td>
            <td>{status}</td>
            <td>{props.tripData.availablePlaces}</td>
            <td className="small"><Link to={`/trips/${tripID}`}><button>View</button></Link></td>
        </tr>
    )
}

export const TripStatus = {
    AVAILABLE: 0, BOOKED: 1, ONGOING: 2, DONE: 3, CANCELED: 4
}