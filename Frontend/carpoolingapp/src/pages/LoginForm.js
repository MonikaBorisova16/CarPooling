
import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import MySnackbar from './MySnackBar'
axios.defaults.withCredentials = true



class LoginForm extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
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
    const self = this;
    let data = {
      username: this.state.username,
      password: this.state.password,
    }

    axios.post("http://localhost:8080/api/users/authenticate", data)
      .then(response => {
        this.props.login(response.data.token);
        this.props.history.push("/")
      })
      .catch(function (error) {
        self.props.toggleSnackBar(error.message)
      })

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
          <div className="loginForm">

            <form onSubmit={this.handleSubmit}>
              <div className="myHeader"><h3>Sign In</h3></div>

              <div className="loginCol">
                <label className="myLabel" htmlFor="username">Username</label>
                <input type="text" id="username" className="FormField__Input"
                  placeholder="Enter your username" name="username" value={this.state.username}
                  onChange={this.handleChange} />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" className="FormField__Input"
                  placeholder="Enter your password" name="password" value={this.state.password}
                  onChange={this.handleChange} />
              </div>
              <div className="FormFieldButton">
                <button className="send">Sign In</button>
                <Link to="/sign-up" className="FormField__Link">Create an account</Link>
              </div>

            </form>
          </div>
        </div>
      </div>

    );
  }
}

export default LoginForm;