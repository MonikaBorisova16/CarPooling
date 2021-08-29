import React from 'react';
import axios from 'axios';
import Car from './Car';
import InfiniteScroll from 'react-infinite-scroll-component';
import "../styles/App.css";
import "../styles/trips.css"

class Cars extends React.Component {
    constructor() {
        super()
        this.state =
        {
            cars: [],
            currentPage: -1,
            hasMore: true,
        }

        this.getCars = this.getCars.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.deleteCar = this.deleteCar.bind(this)

    }

    componentDidMount() {
        this.getCars()
    }

    getCars() {
        let self = this;
        const page = this.state.currentPage + 1;
        axios.get(`http://localhost:8080/api/users/cars`, this.props.header)
            .then(response => {
                self.setState({
                    cars: self.state.cars.concat(response.data),
                    hasMore: response.data!== []?false:!response.data.last,
                    currentPage: page
                })
            })
    }

    deleteCar(carID) {
        let self = this;
        axios.delete(`http://localhost:8080/api/cars/${carID}`, this.props.header)
            .then(() => {
                self.setState({
                    cars: [],
                    hasMore: true,
                    currentPage: -1
                }, self.getCars)
                this.props.toggleSnackBar("Car deleted successfully!")
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

    render() {
        return (
            <div className="App">
                <div className="App__Aside-Left"></div>
                <div className="App__Aside">

                    <InfiniteScroll
                        className="infiniteScroller padding-top"
                        dataLength={this.state.cars.length}
                        next={this.getCars}
                        hasMore={this.state.hasMore}
                        loader={<div className="loader" key={0}>Loading ...</div>}
                    >

                        {this.state.cars.length !== 0 ? this.state.cars.map(car => (
                            <Car key={car._id} carData={car} delete={this.deleteCar} />

                        )) : <h2 className="noTrips">No cars to show</h2>}
                    </InfiniteScroll>

                </div>
            </div>
        )
    }
}

export default Cars;