import React from 'react'
import '../styles/navigation.css';
import {NavLink} from 'react-router-dom'



export default function LoggedInNavigation(props)
{
        return(
            <ul>
                <li><NavLink to="/trip/create" exact activeClassName = "active" className="link">
                <i className="fa fa-road"></i>Create trip
                </NavLink></li>
                <li><NavLink to="/" exact activeClassName = "active" className="link">
            <i className="fa fa-map"></i>Trips
                </NavLink></li>
            <li>
                <NavLink to={`/profile/${props.username}`} activeClassName = "active" className="link">
                <i className="fa fa-id-card"></i>Profile</NavLink>
            </li>
            
            <li><NavLink to="/user/cars" activeClassName = "active" className="link">
            <i className="fa fa-car"></i>Cars
                </NavLink></li>
        </ul>
        )
}


