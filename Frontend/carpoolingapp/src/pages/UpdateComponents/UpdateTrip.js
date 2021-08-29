import React from 'react'
import '../../styles/App.css'
import '../../styles/forms.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import DateTime from 'react-datetime'
import MySnackbar from '../MySnackBar'
import "../../styles/react-datetime.css"

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

class UpdateTrip extends React.Component {
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
        this.handleEdit = this.handleEdit.bind(this)
        this.populateSeats = this.populateSeats.bind(this)
    }

    componentDidMount() {
        this.getUserCars()
        this.getTrip(this.props.match.params.tripid)
    }

    handleEdit() {
        const self = this;
        let { carID, message, departureTime, origin, destination, availablePlaces, allowsLuggage, allowsPets, allowsSmoking } = this.state
        const data =
        {
            id: self.props.match.params.tripid,
            carID: carID,
            message: message,
            departureTime: departureTime,
            origin: origin,
            destination: destination,
            availablePlaces: availablePlaces,
            allowsSmoking: allowsSmoking,
            allowsPets: allowsPets,
            allowsLuggage: allowsLuggage
        }
        axios.put(`http://localhost:8080/api/trips/${self.props.match.params.tripid}`, data, this.props.header)
            .then(() => this.props.toggleSnackBar("Trip updated successfully"))
            .catch(error=>this.props.toggleSnackBar(error.message))
    }

    getTrip(tripid) {
        let self = this;
        axios.get(`http://localhost:8080/api/trips/${tripid}`, this.props.header)
            .then(function (response) {
                const {  message, departureTime, origin, destination, availablePlaces, allowsLuggage, allowsPets, allowsSmoking } = response.data
                self.setState({
                    message: message,
                    departureTime: departureTime,
                    origin: origin,
                    destination: destination,
                    availablePlaces: availablePlaces,
                    allowsSmoking: allowsSmoking,
                    allowsLuggage: allowsLuggage,
                    allowsPets: allowsPets,
                })
            })
    }

    getUserCars() {
        let self = this;
        axios.get(`http://localhost:8080/api/users/cars`, this.props.header)
            .then(function (response) {
                let options = []
                options = response.data.map(car => ({ value: car._id, label: car.carModel }))
                if (JSON.stringify(self.state.userCars) !== JSON.stringify(options)) {
                    let carSeats = response.data.map(car => ({ id: car._id, seats: car.seats }))
                    self.setState({
                        userCars: options,
                        carSeats: carSeats,
                    })
                }
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
        

        return (

            <div className="App">
                <div className="App__Aside-Left"></div>
                <div className="App__Aside">
                <MySnackbar open={this.props.open} message={this.props.message} handleClose={this.props.handleClose}/>
                    <div className="createForm">
                        <div className="header"><h3>Edit trip</h3></div>
                        <div className="column">
                            <div className="createFormField float-right">
                                <label htmlFor="origin">Origin</label>
                                {/* <Select
                                    styles={customStyles}
                                    onChange={this.handleOriginChange}
                                    options={this.state.availableLocations}
                                    placeholder={this.state.origin} /> */}
                            </div>

                            <div className="createFormField float-right">
                                <label>Car</label>
                                <Select
                                    styles={customStyles}
                                    onChange={this.handleCarChange}
                                    options={this.state.userCars} 
                                    placeholder={this.state.carName}/>
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
                                {/* <Select
                                    styles={customStyles}
                                    onChange={this.handleDestinationChange}
                                    options={this.state.availableLocations}
                                    placeholder={this.state.destination} /> */}
                            </div>

                            <div className="createFormField float-left">

                                <label>Available places</label>
                                <Select
                                    styles={customStyles}
                                    onChange={this.handleAvailableChange}
                                    options={this.state.seatOptions}
                                    placeholder={this.state.availablePlaces} />
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
                        <button className="send" onClick={this.handleEdit}>Edit trip</button>
                    </div>

                </div>

            </div>
        )
    }


}


export default UpdateTrip;