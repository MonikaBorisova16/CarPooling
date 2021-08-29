import React from 'react';
import {NavLink} from 'react-router-dom';
import '../styles/navigation.css';
import ProfileBox from './ProfileBox'
import carpoolinglogo from '../images/carpooling-logo.png'
import NotLoggedInNavigation from './NotLoggedInNavigation';
import LoggedInNavigation from './LoggedInNavigation';
class Navigation extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = 
        {
            isLoggedIn:false
        }
    }

    render()
    {
        let logged = this.props.userData.isLoggedIn;
        const isAdmin = this.props.userData.isAdmin;
        let topContainer;
        let buttons;
        let logout = logged ? <button className="logoutButton" onClick={this.props.logout}>Logout</button> : null;
        let usersButton = logged && isAdmin ? <ul><li><NavLink to="/admin/trips" activeClassName = "active" className="link">
            <i className="fa fa-users"></i>Admin panel
            </NavLink></li></ul>:null;
        if(logged)
        {
            topContainer = <ProfileBox userData={this.props.userData}/> 
            buttons = <LoggedInNavigation username={this.props.userData.userDetails.username} />
        }
        else topContainer = <NotLoggedInNavigation />
      
        

        return(
        
            <nav className="nav">
                <div className="logoContainer">
                    <img src={carpoolinglogo} alt="car" className="logo"></img>
                </div>
                {topContainer}
                {buttons}
                {usersButton}
                {logout}
             </nav>
        )
    }
}


export default Navigation;