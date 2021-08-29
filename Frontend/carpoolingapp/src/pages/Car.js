import React from 'react'
import CarImage from "../images/car.png"
import "../styles/trips.css"
import { Link } from 'react-router-dom'

export default function Car(props) {
    const ac =props.carData.airCondition?"yes":"no"
    return (
        <div className="tripContainer">
            <div className="carCard">
                <div className="carInfo">

                    <div className="carProp">
                        <h5>Year Made</h5>
                        <h3><b>{props.carData.yearMade}</b></h3>
                    </div>
                    <div className="carProp">
                        <h5>AC:</h5>
                        <h3><b>{ac}</b></h3>
                    </div>
                    <div className="carProp">
                        <h5>Seats:</h5>
                        <h3><b>{props.carData.seats}</b></h3>
                    </div>
                    <h4>{props.carData.carModel}</h4>
                    <Link to={`/cars/edit/${props.carData._id}`}><button className="carInfoButton">Edit</button></Link>
                    
                    <button className="carInfoButton" onClick={()=>props.delete(props.carData._id)}>Delete</button>
                </div>
                <img src={CarImage} alt="top"></img>
            </div>
        </div>
    )
}