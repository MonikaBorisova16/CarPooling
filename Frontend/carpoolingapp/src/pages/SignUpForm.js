import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import MySnackbar from './MySnackBar'
import "../styles/App.css"
import "../styles/forms.css"

class SignUpForm extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      email: "",
      phone: "",
      errorMessage: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    let target = e.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });

  }

  handleSubmit(e) {
    e.preventDefault();
    let data = {
      username: this.state.username,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      password: this.state.password,
      email: this.state.email,
      phone: this.state.phone,
      avatar: ""
    }

    axios({
      method: 'post',
      url: 'http://localhost:8080/api/users/register',
      data: data
    })
      .then(() => {
        this.props.toggleSnackBar("Registration successful!")
        setTimeout(() => this.props.history.push("/"), 3000)
      })
      .catch(error => this.props.toggleSnackBar(error.message));
  }

  render() {

    return (
      <div className="App">

        <div className="App__Aside-Left"></div>
        <div className="App__Aside">
          <MySnackbar open={this.props.open} message={this.props.message} handleClose={this.props.handleClose} />

          <div className="PageSwitcher">
            <NavLink to="/login" activeClassName="PageSwitcher__Item--Active"
              className="PageSwitcher__Item">Sign In</NavLink>
            <NavLink to="/sign-up" activeClassName="PageSwitcher__Item--Active"
              className="PageSwitcher__Item">Sign Up</NavLink>
          </div>

          <div className="signUpForm">
            <div className="myHeader"><h3>Sign Up</h3></div>
            <form onSubmit={this.handleSubmit} className="myForm">

              <div className="RegisterCol">
                <label className="myLabel" htmlFor="username">Username</label>
                <input type="text" id="username"
                  placeholder="Enter your username" name="username"
                  value={this.state.username} onChange={this.handleChange} />


                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName"
                  placeholder="Enter your first name" name="firstName"
                  value={this.state.firstName} onChange={this.handleChange} />


                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName"
                  placeholder="Enter your last name" name="lastName"
                  value={this.state.lastName} onChange={this.handleChange} />
              </div>

              <div className="RegisterCol">
                <label htmlFor="password">Password</label>
                <input type="password" id="password"
                  placeholder="Enter your password" name="password"
                  value={this.state.password} onChange={this.handleChange} />

                <label htmlFor="Email">Email</label>
                <input type="text" id="email"
                  placeholder="Enter your email" name="email"
                  value={this.state.email} onChange={this.handleChange} />

                <label htmlFor="phone">Phone</label>
                <input type="text" id="phone"
                  placeholder="Enter your phone" name="phone"
                  value={this.state.phone} onChange={this.handleChange} />
              </div>
              <button className="send" >Sign Up</button>
              <Link to="/login" className="FormField__Link">I'm already member</Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUpForm;