import React from 'react'
import '../../styles/App.css'
import '../../styles/forms.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import DateTime from 'react-datetime'
import MySnackbar from '../MySnackBar'
import "../../styles/react-datetime.css"


class CreateTrip extends React.Component {
    constructor(props) {
        super(props)
        this.state =
        {
            allowsLuggage: false,
            allowsPets: false,
            allowsSmoking: false,
            availablePlaces: 0,
            carID: 0,
            carName: "",
            departureTime: "",
            destination: "",
            message: "",
            origin: "",
            availableLocations: [],
            userCars: [],
            carSeats: [],
            seatOptions: [],
        }
        this.handleAvailableChange = this.handleAvailableChange.bind(this)
        this.handleOriginChange = this.handleOriginChange.bind(this)
        this.handleDestinationChange = this.handleDestinationChange.bind(this)
        this.calendarOnChange = this.calendarOnChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getUserCars = this.getUserCars.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
        this.populateSeats = this.populateSeats.bind(this)
    }

    componentDidMount() {
        // axios.get("http://localhost:8080/api/trips/locations")
        // .then(function(response)
        // {
        //     let options = []
        //     options =response.data.map(location => ({ value: location.id, label: location.name }))
        //     self.setState({availableLocations: options});
        // })
        var options = [{ value: 1, label: "Sofia" }, { value: 2, label: "Yambol" }, { value: 3, label: "Burgas" }]
        this.setState({ availableLocations: options });
        this.getUserCars()
    }

    doCreate() {

        // let { carID, message, departureTime, origin, destination, availablePlaces, allowsLuggage, allowsPets, allowsSmoking, estimatedTripLength, estimatedTripTime } = this.state
        // const data =
        // {
        //     carID: carID,
        //     message: message,
        //     departureTime: departureTime,
        //     origin: origin,
        //     destination: destination,
        //     availablePlaces: availablePlaces,
        //     allowsSmoking: allowsSmoking,
        //     allowsPets: allowsPets,
        //     allowsLuggage: allowsLuggage,
        //     estimatedTime: estimatedTripTime,
        //     length: estimatedTripLength
        // }
        // axios.post("http://localhost:8080/api/trips", data, this.props.header)
        //     .then(() => {
        //         this.props.toggleSnackBar("Trip created successfully!")
        //         setTimeout(() => this.props.history.push("/"), 3000)
        //     })
        //     .catch(error => this.props.toggleSnackBar(error.response.data.message))
    }


    async handleCreate() {
        //     const apiKey=process.env.REACT_APP_BING_API_KEY
        //     // const LOCATIONS_BASE = "http://dev.virtualearth.net/REST/v1/Locations"
        //     // const DISTANCE_BASE = "https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix"

        //     // // Make first two requests
        //     // const [firstResponse, secondResponse] = await Promise.all([
        //     //   axios.get(`${LOCATIONS_BASE}/${this.state.origin}?maxResults=1&key=${apiKey}`,{withCredentials: false}),
        //     //   axios.get(`${LOCATIONS_BASE}/${this.state.destination}?maxResults=1&key=${apiKey}`,{withCredentials: false})
        //     // ]);

        //     // const originLon = firstResponse.data.resourceSets[0].resources[0].geocodePoints[0].coordinates[0]
        //     // const originLat = firstResponse.data.resourceSets[0].resources[0].geocodePoints[0].coordinates[1]
        //     // const destLon = secondResponse.data.resourceSets[0].resources[0].geocodePoints[0].coordinates[0]
        //     // const destLat = secondResponse.data.resourceSets[0].resources[0].geocodePoints[0].coordinates[1]

        //     // const thirdResponse = await axios.get(`${DISTANCE_BASE}?origins=${originLon},${originLat}&destinations=${destLon},${destLat}&travelMode=driving&key=${apiKey}`,{withCredentials: false});

        //     // Update state once with all 3 responses
        // this.setState({
        //   estimatedTripLength: thirdResponse.data.resourceSets[0].resources[0].results[0].travelDistance,
        //   estimatedTripTime: thirdResponse.data.resourceSets[0].resources[0].results[0].travelDuration
        // },this.doCreate);
        // this.doCreate()
        
        let { carID, message, departureTime, origin, destination, availablePlaces, allowsLuggage, allowsPets, allowsSmoking } = this.state
        const data =
        {
            carID: carID,
            message: message,
            departureTime: departureTime,
            origin: origin,
            destination: destination,
            availablePlaces: availablePlaces,
            allowsSmoking: allowsSmoking,
            allowsPets: allowsPets,
            allowsLuggage: allowsLuggage,
        }
        axios.post("http://localhost:8080/api/trips", data, this.props.header)
            .then(() => {
                this.props.toggleSnackBar("Trip created successfully!")
                setTimeout(() => this.props.history.push("/"), 3000)
            })
            .catch(error => this.props.toggleSnackBar(error.message))
    }

    getUserCars() {
        let self = this;
        axios.get(`http://localhost:8080/api/users/cars`, this.props.header)
            .then(function (response) {
                let options = [];
                options = response.data.map(car => ({
                    value: car._id, label: car.carModel
                }))
                if (JSON.stringify(self.state.userCars) !== JSON.stringify(options)) {
                    let carSeats = response.data.map(car => ({ id: car._id, seats: car.seats }))
                    self.setState({
                        userCars: options,
                        carSeats: carSeats
                    })
                }
            }).catch(error => {
                this.props.toggleSnackBar(error.message);
            })
    }

    handleAvailableChange = selectedOption => {
        this.setState({
            availablePlaces: selectedOption.value
        })
    };

    handleCarChange = selectedOption => {
        this.setState({
            carID: selectedOption.value,
            carName: selectedOption.label
        })
        this.populateSeats(selectedOption.value)
    }

    populateSeats(carID) {
        let car = this.state.carSeats.find(car => car.id === carID)
        let seats = []
        for (let i = 1; i < car.seats; ++i) {
            seats.push({ value: i, label: i })
        }
        this.setState({
            seatOptions: seats
        })
    }

    handleOriginChange = selectedOption => {
        this.setState({
            origin: selectedOption.label
        })
    };

    handleDestinationChange = selectedOption => {
        this.setState({
            destination: selectedOption.label
        })
    };

    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
            [name]: value
        });

    }

    calendarOnChange = moment => {
        let date = moment.format('DD-MM-YY HH:mm');
        this.setState({ departureTime: date })
    }

    render() {
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
                border: "2px solid #0a91ca",
                textalign: "center",
                '&:hover': {
                    border: "2px solid #055b80",
                    cursor: "pointer"
                }
            })
        }

        return (

            <div className="App">
                <div className="App__Aside-Left"></div>
                <div className="App__Aside">
                    <MySnackbar open={this.props.open} message={this.props.message} handleClose={this.props.handleClose} />
                    <div className="createForm">
                        <div className="header"><h3>Create your own trip</h3></div>
                        <div className="column">
                            <div className="createFormField float-right">
                                <label htmlFor="origin">Origin</label>
                                <Select
                                    styles={customStyles}
                                    onChange={this.handleOriginChange}
                                    options={this.state.availableLocations} />
                            </div>

                            <div className="createFormField float-right">
                                <label>Car</label>
                                <Select
                                    styles={customStyles}
                                    onChange={this.handleCarChange}
                                    options={this.state.userCars} />
                                <Link to="/cars/create"><button className="button">Create new car</button></Link>

                                <div className="calendarContainer" >
                                    <label htmlFor="origin">Departure time</label>
                                    <DateTime className="calendar"
                                        inputProps={{ placeholder: 'Select departure time' }}
                                        onChange={this.calendarOnChange}
                                        dateFormat="DD-MM-YY"
                                        timeFormat="HH:mm" />
                                </div>
                            </div>


                            <div className="createFormField float-right">
                                <label htmlFor="message">Your message here</label>
                                <textarea maxLength="150" name="message" onChange={this.handleChange} value={this.state.message}></textarea>
                            </div>

                        </div>
                        <div className="column">
                            <div className="createFormField float-left">

                                <label htmlFor="destination">Destination</label>
                                <Select
                                    styles={customStyles}
                                    onChange={this.handleDestinationChange}
                                    options={this.state.availableLocations} />
                            </div>

                            <div className="createFormField float-left">

                                <label>Available places</label>
                                <Select
                                    styles={customStyles}
                                    placeholder="Available places"
                                    onChange={this.handleAvailableChange}
                                    options={this.state.seatOptions} />
                            </div>

                            <div className="createFormField float-left">
                                <i className="fa fa-suitcase"></i>
                                <div className="control-group">
                                    <label className="control control-checkbox">
                                        Allow passengers to have luggage
                        <input type="checkbox" name="allowsLuggage" checked={this.state.allowsLuggage} onChange={this.handleChange} />
                                        <div className="control_indicator"></div>
                                    </label></div>
                            </div>

                            <div className="createFormField float-left">
                                <i className="fa fa-magic"></i>
                                <div className="control-group">
                                    <label className="control control-checkbox">
                                        Allow passengers to smoke in the car
                        <input type="checkbox" name="allowsSmoking" checked={this.state.allowsSmoking} onChange={this.handleChange} />
                                        <div className="control_indicator"></div>
                                    </label></div>
                            </div>

                            <div className="createFormField float-left">
                                <i className="fa fa-paw"></i>
                                <div className="control-group">
                                    <label className="control control-checkbox">
                                        Allow passengers to take pets
                        <input type="checkbox" name="allowsPets" checked={this.state.allowsPets} onChange={this.handleChange} />
                                        <div className="control_indicator"></div>
                                    </label></div>
                            </div>

                        </div>
                        <button className="send" onClick={this.handleCreate}>Create trip</button>
                    </div>

                </div>

            </div>
        )
    }
}


export default CreateTrip;