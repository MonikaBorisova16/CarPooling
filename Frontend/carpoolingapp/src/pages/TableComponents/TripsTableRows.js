import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { TableCell } from '@material-ui/core';
import TableRow from "@material-ui/core/TableRow";

export default function TripsTableRows(props) {
    const tripID = props.tripData._id;
    let date = moment(props.tripData.departureTime, 'DD/MM/YYYY').format("MMMM Do YYYY, HH:mm")
    return (
        <TableRow>
            <TableCell align="left">
                {props.tripData.driverUsername}</TableCell>
            <TableCell align="center">{props.tripData.origin}</TableCell>
            <TableCell align="center">{props.tripData.destination}</TableCell>
            <TableCell align="center">{date}</TableCell>
            <TableCell align="center" className="small">
                <Link to={`/trips/${tripID}`}><button className="button">View</button></Link>
                <button className="button" onClick={() => props.delete(props.tripData._id)}>Delete</button>
            </TableCell>
        </TableRow>
    )
}