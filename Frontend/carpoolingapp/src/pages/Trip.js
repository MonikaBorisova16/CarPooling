import React from 'react'
import TripImage from "../images/trip-img.png"
import "../styles/trips.css"
import moment from 'moment'
import { Link } from 'react-router-dom'
import axios from 'axios';

export default function Trip(props) {
  let date = moment(props.tripData.departureTime, 'DD/MM/YYYY').format("MMMM Do YYYY, HH:mm")
  return (
    <div className="tripContainer">
      <div className="tripCard fade-in">
        <div className="tripInfo">
          <div className="loc">
            <h5>from:</h5>
            <h3><b>{props.tripData.origin}</b></h3>
          </div>
          <div className="loc">
            <h5>to:</h5>
            <h3><b>{props.tripData.destination}</b></h3>
          </div>
          <h4>{date}</h4>
          <p>Driver: <b>{props.tripData.driverFirstName} {props.tripData.driverLastName}</b></p>
          <p>Available places:<b> {props.tripData.availablePlaces}</b></p>
          <Link to={`/trips/${props.tripData._id}`}><button className="tripInfoButton">Trip info</button></Link>
          <Link to={`/profile/${props.tripData.driverUsername}`}><button className="tripInfoButton">Driver info</button></Link>
        </div>
        <img src={TripImage} alt="top"></img>

      </div>
    </div>
  )
}
