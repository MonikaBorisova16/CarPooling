import React from 'react'

export default function TripInfo(props) {
    const { allowsLuggage, allowsPets, allowsSmoking } = props.tripData
    const { carModel, yearMade, air } = props.car
    const hasAC = air ? "Yes" : "No"
    const smoking = allowsSmoking ? "Allowed" : "Not allowed"
    const pets = allowsPets ? "Allowed" : "Not allowed"
    const luggage = allowsLuggage ? "Allowed" : "Not allowed"
    return (
        <div className="info">
            <h3>Vehicle model:</h3>
            <h2>{carModel}</h2>
            <h3>Vehicle year:</h3>
            <h2>{yearMade}</h2>
            <h3>Air conditioner:</h3>
            <h2>{hasAC}</h2>
            <h3>Luggage:</h3>
            <h2>{luggage}</h2>
            <h3>Smoking:</h3>
            <h2>{smoking}</h2>
            <h3>Pets:</h3>
            <h2>{pets}</h2>
        </div>
    )
}