import React from 'react';
import axios from 'axios';
import Trip from './Trip'
import InfiniteScroll from 'react-infinite-scroll-component'
import "../styles/App.css"
import "../styles/trips.css"
import Select from 'react-select'

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'white' : 'black',
    backgroundColor: state.isSelected ? '#0a91ca' : 'white',
    '&:hover': {
      backgroundColor: "#a8dcf3",
      color: "black",
      cursor: "pointer"
    }
  }),

  control: (provided) => ({
    ...provided,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "0",
    border: "1px solid #07aff7",
    fontWeight: "lighter",
    margin: "1.5% 0 2px 2%",
    '&:hover': {
      cursor: "pointer"
    }
  })
}

class Trips extends React.Component {
  constructor() {
    super()
    this.state =
    {
      trips: [],
      // currentPage: -1,
      hasMore: false,
      smokingCriteria: "",
      petsCriteria: "",
      luggageCriteria: "",
      originCriteria: "",
      destinationCriteria: "",
      statusCriteria: "",
      timeCriteria: "",
      driverCriteria: "",
      statusOptions: [{ value: "AVAILABLE", label: "Available" }, { value: "BOOKED", label: "Booked" }, { value: "ONGOING", label: "Ongoing" },
      { value: "DONE", label: "Done" }, { value: "CANCELED", label: "Cancelled" }],
      timeOptions: [{ value: true, label: "Earliest" }, { value: false, label: "Latest" }]
    }

    this.getTrips = this.getTrips.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.filterTrips = this.filterTrips.bind(this)
    this.handleDestinationChange = this.handleDestinationChange.bind(this)
    this.handleOriginChange = this.handleOriginChange.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.handleTimeChange = this.handleTimeChange.bind(this)
    this.resetFilter = this.resetFilter.bind(this)
  }

  componentDidMount() {
    this.getTrips()
  }

  getTrips() {

    const { driverCriteria, statusCriteria, destinationCriteria, originCriteria, smokingCriteria, luggageCriteria, petsCriteria, timeCriteria } = this.state
    let self = this;
    // let page = currentPage + 1

    // const URL = `${BASE_URL}?page=${page}&size=8&driver=${driverCriteria}&origin=${originCriteria}&destination=${destinationCriteria}&status=${statusCriteria}&allows_pets=${petsCriteria}&allows_luggage=${luggageCriteria}&allows_smoking=${smokingCriteria}&earliest=${timeCriteria}`
    axios.get("http://localhost:8080/api/trips", this.props.header)
      .then(function (response) {
        self.setState({
          trips: response.data, 
          // hasMore: !response.data.last,
          // currentPage: page
        })
      })
  }

  filterTrips() {
    let self = this
    self.setState({
      // currentPage: -1,
      trips: [],
      hasMore: false
    }, this.getTrips
    )
  }

  handleTimeChange = selectedOption => {
    this.setState({
      timeCriteria: selectedOption === null ? "" : selectedOption.value
    })
    this.filterTrips()
  }

  handleOriginChange = selectedOption => {
    this.setState({
      originCriteria: selectedOption === null ? "" : selectedOption.value
    })
    this.filterTrips()
  };

  handleDestinationChange = selectedOption => {
    this.setState({
      destinationCriteria: selectedOption === null ? "" : selectedOption.value
    })
    this.filterTrips()
  };

  handleStatusChange = selectedOption => {
    this.setState({
      statusCriteria: selectedOption === null ? "" : selectedOption.value
    })
    this.filterTrips()
  };

  resetFilter() {
    this.setState({
      smokingCriteria: "",
      petsCriteria: "",
      luggageCriteria: "",
      originCriteria: "",
      destinationCriteria: "",
      statusCriteria: "",
      timeCriteria: "",
      driverCriteria: ""
    })
    this.filterTrips()
  }

  handleChange(e) {
    let target = e.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
    this.filterTrips()
  }

  render() {
    return (
      <div className="App">
        <div className="App__Aside-Left"></div>
        <div className="App__Aside">
          <div className="searchContainer">
            <input type="text" className="driverInput" placeholder="Filter by driver" name="driverCriteria"
              onChange={this.handleChange} value={this.state.driverCriteria}></input>

            {/* <Select 
                    options={this.state.availableLocations} 
                    className="smallSelect" 
                    onChange={this.handleOriginChange}
                    styles={customStyles} 
                    isClearable={true}
                    placeholder="Filter by origin"/>  

                    <Select 
                    options={this.state.availableLocations}
                    className="smallSelect" 
                    styles={customStyles}
                    onChange={this.handleDestinationChange}
                    isClearable={true} 
                    placeholder="Filter by destination"/>  */}

            <Select
              options={this.state.statusOptions}
              isClearable={true}
              onChange={this.handleStatusChange}
              className="smallSelect"
              styles={customStyles}
              placeholder="Filter by status" />

            <Select
              options={this.state.timeOptions}
              isClearable={true}
              onChange={this.handleTimeChange}
              className="smallSelect"
              styles={customStyles}
              placeholder="Sort by time" />

            <div className="control-group">

              <label className="control control-checkbox">
                <i className="fa fa-suitcase"></i>
                <input type="checkbox" name="luggageCriteria" checked={this.state.luggageCriteria} onChange={this.handleChange} />
                <div className="control_indicator"></div>
              </label></div>

            <div className="control-group">

              <label className="control control-checkbox">
                <i className="fa fa-magic"></i>
                <input type="checkbox" name="smokingCriteria" checked={this.state.smokingCriteria} onChange={this.handleChange} />
                <div className="control_indicator"></div>
              </label></div>

            <div className="control-group">

              <label className="control control-checkbox">
                <i className="fa fa-paw"></i>
                <input type="checkbox" name="petsCriteria" checked={this.state.petsCriteria} onChange={this.handleChange} />
                <div className="control_indicator"></div>
              </label></div>

            <button onClick={this.resetFilter}>Reset</button>
          </div>
          <InfiniteScroll
            className="infiniteScroller padding-top-trips"
            dataLength={this.state.trips.length}
            next={this.getTrips}
            hasMore={this.state.hasMore}
            loader={<div className="loader">Loading .....</div>}
          >

            {this.state.trips.length !== 0 ? this.state.trips.map(trip => (
              <Trip key={trip._id} tripData={trip} header={this.props.header}/>
            )) : <h2 className="noTrips">No trips to show</h2>}
          </InfiniteScroll>

        </div>
      </div>
    )
  }
}


export default Trips;