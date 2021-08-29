import React from 'react'
import "../../styles/App.css"
import "../../styles/forms.css"
import Select from 'react-select'
import axios from 'axios';
import MySnackbar from '../MySnackBar'
axios.defaults.withCredentials = true

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

class UpdateCar extends React.Component {
    constructor(props) {
        super(props)
        this.state =
            {
                model: "",
                seats: 4,
                hasAirConditioner: true,
                yearMade: 2011,
                image: null
            }
        this.handleChange = this.handleChange.bind(this)
        this.populateSeatOptions = this.populateSeatOptions.bind(this)
        this.handleSeatsChange = this.handleSeatsChange.bind(this)
        this.handleYearChange = this.handleYearChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        let self = this;
        const carid = this.props.match.params.carid;

        axios.get(`http://localhost:8080/api/cars/get/${carid}`, this.props.header)
            .then(function (response) {
                const { carModel, yearMade, airConditioner, seats } = response.data
                self.setState(
                    {
                        model: carModel,
                        seats: seats,
                        hasAirConditioner: airConditioner,
                        yearMade: yearMade
                    })
            })
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

    handleSubmit(e) {
        e.preventDefault();
        const data =
        {
            id: this.props.match.params.carid,
            carModel: this.state.model,
            seats: this.state.seats,
            airCondition: this.state.hasAirConditioner,
            yearMade: this.state.yearMade
        }

        axios.put(`http://localhost:8080/api/cars/${data.id}`, data, this.props.header)
            .then(()=> this.props.toggleSnackBar("Car updated successfully!"))
            .catch(error=>this.props.toggleSnackBar(error.message))
    }

    render() {
        let seatOptions = [];
        let yearOptions = [];
        this.populateSeatOptions(seatOptions, 8);
        this.populateYearOptions(yearOptions)
        

        return (
            <div className="App">
                <div className="App__Aside-Left"></div>
                <div className="App__Aside">
                <MySnackbar open={this.props.open} message={this.props.message} handleClose={this.props.handleClose}/>
                    <div className="createForm">
                        <div className="header"><h3>Edit your car</h3></div>
                        <div className="centeredForm">

                            <label htmlFor="model">Car model</label>
                            <input type="text" name="model" placeholder={this.state.model}
                                value={this.state.model} onChange={this.handleChange}></input>

                            <label htmlFor="seats">Number of car seats</label>
                            <Select
                                options={seatOptions}
                                styles={customStyles}
                                placeholder={this.state.seats}
                                onChange={this.handleSeatsChange}
                            />

                            <label htmlFor="seats">Year made</label>
                            <Select
                                options={yearOptions}
                                styles={customStyles}
                                placeholder={this.state.yearMade}
                                onChange={this.handleYearChange}
                            />

                            <i className="fa fa-thermometer-empty"></i>
                            <div className="control-group">
                                <label className="control control-checkbox ">
                                    Does the car have air conditioner?
                        <input type="checkbox" name="hasAirConditioner" onChange={this.handleChange} checked={this.state.airConditioner} />
                                    <div className="control_indicator controlRight"></div>
                                </label>
                                </div>
                            
                            <button className="send" onClick={this.handleSubmit}>Edit car</button>
                        </div>


                    </div>
                </div>
            </div>
        )
    }
}



export default UpdateCar; 