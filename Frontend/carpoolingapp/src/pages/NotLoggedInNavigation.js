import React from 'react'
import '../styles/navigation.css';
import {NavLink} from 'react-router-dom'

class NotLoggedInNavigation extends React.Component
{
    render()
    {
        return(
           <ul>
               <li><NavLink to="/" exact activeClassName = "active" className="link">
               <i className="fa fa-map"></i>Trips
           </NavLink></li>
           <li>
           <NavLink to="/login" activeClassName = "active" className="link">
           <i className="fa fa-id-card"></i>Login</NavLink>
       </li>
       <li><NavLink to="/sign-up" exact activeClassName = "active" className="link">
       <i className="fa fa-user-plus"></i>Register
           </NavLink></li>
           </ul>
        )
    }
}



export default NotLoggedInNavigation;