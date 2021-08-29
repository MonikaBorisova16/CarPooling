import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import SignUpForm from './pages/SignUpForm.js';
import LoginForm from './pages/LoginForm.js';
import UserProfile from './pages/UserProfile'
import UpdateProfile from './pages/UpdateComponents/UpdateProfile'
import CreateTrip from './pages/CreateComponents/CreateTrip'
import CreateCar from './pages/CreateComponents/CreateCar'
import Trips from './pages/Trips'
import TripProfile from './pages/TripProfile'
import Cars from './pages/Cars'
import UpdateTrip from './pages/UpdateComponents/UpdateTrip'
import UpdateCar from './pages/UpdateComponents/UpdateCar'
import ManageTrip from './pages/ManageTrip'
import axios from 'axios'

import './styles/App.css';
import Navigation from './pages/Navigation.js';
import TripsTable from './pages/TableComponents/TripsTable.js';
import UsersTable from './pages/TableComponents/UsersTable.js';
import jwt_decode from 'jwt-decode'

axios.defaults.withCredentials = true;
class App extends Component {
  constructor(props) {
    super(props)

    this.state =
    {
      isLoggedIn: false,
      isAdmin: false,
      userDetails: {},
      isLoading: true,
      open: false,
      message: "",
      jwt: "",
      header: {}
    }

    this.refresh = this.refresh.bind(this)
    this.authenticate = this.authenticate.bind(this)
    this.logout = this.logout.bind(this)
    this.getMeInState = this.getMeInState.bind(this)
    this.toggleSnackBar = this.toggleSnackBar.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidMount() {
    this.getMeInState();
  }

  getMeInState() {
    if (this.state.isLoggedIn) {
      this.setState({ isLoading: true })
      let self = this;
      var yourConfig = {
        headers: {
          Authorization: "Bearer " + self.state.jwt
        }
      }
      axios.get("http://localhost:8080/api/users/authenticate/me", yourConfig)
        .then(function (response) {
          self.setState(
            {
              userDetails: response.data,
              isLoading: false,
              header: yourConfig
            })
        }).catch(error => self.setState({ isLoading: false }))
    }
    else {
      this.setState({ isLoading: false })
    }
  }

  refresh() {
    this.getMeInState()
  }

  authenticate(jwt) {
    const token = jwt_decode(jwt)
    if (token.role === 0) {
      this.setState({
        isAdmin: true
      })
    }
    this.setState({
      jwt: jwt,
      isLoggedIn: true
    }, () => this.getMeInState())
  }

  logout() {
    let self = this;
    axios.post("http://localhost:8080/api/users/logout", self.state.header).then(response => {
      self.setState({ isLoggedIn: false, isAdmin: false })
    })
  }

  toggleSnackBar(msg) {
    this.setState({
      open: true,
      message: msg
    })
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      open: false
    });
  }

  render() {
    let navComponent = <Navigation
      logout={this.logout}
      userData={this.state}
    />
    return (
      this.state.isLoading ? <h1>loading</h1> :

        <Router>

          {navComponent}
          <Switch>

            <Route
              path='/sign-up' exact
              render={(props) => <SignUpForm {...props} toggleSnackBar={this.toggleSnackBar} handleClose={this.handleClose}
                open={this.state.open} message={this.state.message} />}
            />

            <Route
              path='/login' exact
              render={(props) => <LoginForm {...props} login={this.authenticate} toggleSnackBar={this.toggleSnackBar} handleClose={this.handleClose}
                open={this.state.open} message={this.state.message} />}
            />

            <Route path="/" exact render={(props) => <Trips {...props} toggleSnackBar={this.toggleSnackBar} handleClose={this.handleClose}
              open={this.state.open} message={this.state.message} header={this.state.header} />}
            />

            {this.state.isLoggedIn ? <Fragment>
              <Route
                path='/trip/create'
                render={(props) => <CreateTrip {...props} username={this.state.userDetails.username} header={this.state.header} toggleSnackBar={this.toggleSnackBar} handleClose={this.handleClose}
                  open={this.state.open} message={this.state.message} />}
              />

              <Route
                path='/cars/create' exact
                render={(props) => <CreateCar {...props} header={this.state.header} toggleSnackBar={this.toggleSnackBar} handleClose={this.handleClose}
                  open={this.state.open} message={this.state.message} />}
              />

              <Route
                path='/profile/:username/edit' exact
                render={(props) => <UpdateProfile {...props} refresh={this.refresh} userID={this.state.userDetails.id} toggleSnackBar={this.toggleSnackBar} handleClose={this.handleClose} header={this.state.header}
                  open={this.state.open} message={this.state.message} />}
              />
              <Route
                path="/profile/:username" exact
                render={(props) => <UserProfile {...props} loggedUsername={this.state.userDetails.username} header={this.state.header} />}
              />
              <Route
                path="/trips/:tripid" exact
                render={(props) => <TripProfile {...props} loggedID={this.state.userDetails.id} header={this.state.header} toggleSnackBar={this.toggleSnackBar} handleClose={this.handleClose}
                  open={this.state.open} message={this.state.message} />}
              />

              <Route
                path="/trips/:tripid/manage" exact
                render={(props) => <ManageTrip {...props} toggleSnackBar={this.toggleSnackBar} header={this.state.header} handleClose={this.handleClose}
                  open={this.state.open} message={this.state.message} />}
              />

              <Route
                path="/trips/:tripid/edit" exact
                render={(props) => <UpdateTrip {...props} username={this.state.userDetails.username} header={this.state.header} toggleSnackBar={this.toggleSnackBar} handleClose={this.handleClose}
                  open={this.state.open} message={this.state.message} />}
              />

              <Route path="/user/cars" exact render={(props) => <Cars {...props} toggleSnackBar={this.toggleSnackBar} handleClose={this.handleClose}
                open={this.state.open} message={this.state.message} header={this.state.header} />}
              />

              <Route
                path="/cars/edit/:carid" exact
                render={(props) => <UpdateCar {...props} toggleSnackBar={this.toggleSnackBar} handleClose={this.handleClose}
                  open={this.state.open} message={this.state.message} header={this.state.header} />}
              />

              {this.state.isAdmin ? <Fragment>
                <Route path="/admin/trips" exact render={(props) => <TripsTable {...props} header={this.state.header} />} />
                <Route path="/admin/users" exact render={(props) => <UsersTable {...props} header={this.state.header} />} /></Fragment> : null}</Fragment>
              : <Redirect to="/login" />}
          </Switch>
        </Router>
    )
  }

}


export default App;
