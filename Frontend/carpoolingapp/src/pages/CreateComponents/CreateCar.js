import React from 'react'
import "../../styles/App.css"
import "../../styles/forms.css"
import Select from 'react-select'
import axios from 'axios';
import MySnackbar from '../MySnackBar'
axios.defaults.withCredentials = true


class CreateCar extends React.Component {
    constructor(props) {
        super(props)
        this.state =
        {
            carModel: "",
            seats: 4,
            airCondition: true,
            yearMade: 2011
        }
        this.handleChange = this.handleChange.bind(this)
        this.populateSeatOptions = this.populateSeatOptions.bind(this)
        this.handleSeatsChange = this.handleSeatsChange.bind(this)
        this.handleYearChange = this.handleYearChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
            [name]: value
        });

    }

    handleSeatsChange = selectedOption => {
        this.setState({
            seats: selectedOption.value
        })
    };

    handleYearChange = selectedOption => {
        this.setState({ yearMade: selectedOption.value })
    }

    populateSeatOptions(options, size) {
        for (let i = 1; i <= size; ++i) {
            options.push({ value: i, label: i })
        }
    }

    populateYearOptions(options) {
        const currentYear = new Date().getFullYear();
        const minYear = 1960;
        for (let i = minYear; i <= currentYear; ++i) {
            options.push({ value: i, label: i })
        }
    }

    handleSubmit() {
        const data =
        {
            carModel: this.state.carModel,
            seats: this.state.seats,
            airCondition: this.state.airCondition,
            yearMade: this.state.yearMade
        }
        axios.post("http://localhost:8080/api/cars", data, this.props.header)
            .then(() => {
                this.props.toggleSnackBar("Car created successfully")
                setTimeout(() => this.props.history.push("/user/cars"), 3000)
            })
            .catch(error => this.props.toggleSnackBar(error.response.data.message))
    }

    render() {
        let seatOptions = [];
        let yearOptions = [];
        this.populateSeatOptions(seatOptions, 8);
        this.populateYearOptions(yearOptions)
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
                width: "80%",
                border: "2px solid #0a91ca",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "4%",
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
                        <div className="header"><h3>Create your car</h3></div>
                        <div className="centeredForm">

                            <label htmlFor="model">Car model</label>
                            <input type="text" name="carModel" placeholder="Insert the model of you car"
                                value={this.state.model} onChange={this.handleChange}></input>

                            <label htmlFor="seats">Number of car seats</label>
                            <Select
                                options={seatOptions}
                                styles={customStyles}
                                placeholder="Number of car seats"
                                onChange={this.handleSeatsChange}
                            />

                            <label htmlFor="seats">Year made</label>
                            <Select
                                options={yearOptions}
                                styles={customStyles}
                                placeholder="Year made"
                                onChange={this.handleYearChange}
                            />

                            <i className="fa fa-thermometer-empty"></i>
                            <div className="control-group">
                                <label className="control control-checkbox ">
                                    Does the car have air conditioner?
                        <input type="checkbox" name="airCondition" onChange={this.handleChange} checked={this.state.hasAirCondition} />
                                    <div className="control_indicator controlRight"></div>
                                </label></div>


                            <button className="send" onClick={this.handleSubmit}>Create car</button>
                        </div>


                    </div>
                </div>
            </div>
        )
    }
}



export default CreateCar;