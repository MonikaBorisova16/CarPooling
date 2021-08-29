import express, { Request, Response } from 'express';
import { getTripStatusValue, Trip, TripStatus, TripDoc, PassengerStatus } from '../models/Trip';
import { Car } from '../models/Car';
import { User, UserDetails } from '../models/User';
import { Comment } from '../models/Comment';
import jwt from 'jsonwebtoken';
import JWT from '../models/JWT';

import cors from 'cors';

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}
const router = express.Router()
router.use(cors(corsOptions))

//Get trip by ID
router.get('/api/trips/:tripId', async (req: Request, res: Response) => {
    const trip = await Trip.findById(req.params.tripId);
    return res.status(200).send(trip);
})

//Get trip by user
router.get('/api/trips/user/:username', async (req: Request, res: Response) => {
    const trips = await Trip.find(({ driverUsername: req.params.username, deleted: false }));
    return res.status(200).send(trips);
})

//Get all trips
router.get('/api/trips', async (req: Request, res: Response) => {
    const trips = await Trip.find({deleted: false});
    return res.status(200).send(trips);
})

//Create trip
router.post('/api/trips', async (req: Request, res: Response) => {
    const { carID, message, departureTime, origin, destination, allowsSmoking, allowsPets, allowsLuggage, availablePlaces } = req.body;
    try {
        var token = req.headers.authorization?.substr(7)
        const decoded = jwt.verify(token as string, "secret") as JWT;
        const car = await Car.findById(carID);
        if (car?.ownerID != decoded.id) {
            return res.status(400).sendStatus(400);
        }
        const driver = await User.findById(decoded.id);
        const details = await UserDetails.findById(driver?.userDetailsID)
        var seats = car?.seats;
        if (details !== null && driver !== null) {
            const trip = Trip.build({ carID, message, departureTime, origin, destination, allowsSmoking, allowsPets, allowsLuggage, availablePlaces }, decoded.id, details.firstName, details.lastName, driver.username);
            trip.save();
            driver.signedTrips.push(trip._id);
            driver.save();
        }

    } catch (error) {
        return res.status(400).sendStatus(400);
    }
    return res.status(201).sendStatus(201);
})

//Edit trip
router.put('/api/trips/:tripID', async (req: Request, res: Response) => {
    const { carID, message, departureTime, origin, destination, allowsSmoking, allowsPets, allowsLuggage } = req.body;
    try {
        const token = req.headers.authorization?.substr(7)
        const decoded = jwt.verify(token as string, "secret") as JWT;
        const trip = await Trip.findById(req.params.tripID);
        if (trip?.driverID != decoded.id) {
            return res.status(400).sendStatus(400);
        }
        const car = await Car.findById(carID);
        if (car?.ownerID != decoded.id) {
            return res.status(400).sendStatus(400);
        }
        trip.carID = carID;
        trip.message = message;

        trip.departureTime = departureTime;
        trip.origin = origin;
        trip.destination = destination;

        trip.allowsSmoking = allowsSmoking;
        trip.allowsPets = allowsPets;
        trip.allowsLuggage = allowsLuggage;

        await trip.save();

    } catch (error) {
        return res.status(400).sendStatus(400);
    }
    return res.status(201).sendStatus(200);
})

//Change trip status
router.patch('/api/trips/status/:tripID', async (req: Request, res: Response) => {
    const { status } = req.body;
    try {
        const token = req.headers.authorization?.substr(7)
        const decoded = jwt.verify(token as string, "secret") as JWT;
        const trip = await Trip.findById(req.params.tripID);
        if (trip?.driverID != decoded.id) {
            return res.status(400).sendStatus(400);
        }
        var validatedStatus = TripStatus.AVAILABLE;
        if (trip.status == TripStatus.DONE || trip.status == TripStatus.CANCELED)
            throw new Error("You cannot change back the status of an ended or canceled trip");
        if (status == TripStatus.BOOKED || status == TripStatus.CANCELED || status == TripStatus.DONE || status == TripStatus.ONGOING) {
            validatedStatus = getTripStatusValue(status);
        }
        if (validatedStatus == TripStatus.AVAILABLE)
            throw new Error("Cant change status back to available");
        if (validatedStatus == TripStatus.DONE && (trip.status != TripStatus.ONGOING)) {
            throw new Error("You cannot change trip status to Done if previous status is different from Ongoing");
        }

        trip.status = validatedStatus;
        await trip.save();

    } catch (error) {
        return res.status(400).sendStatus(400);
    }
    return res.status(201).sendStatus(200);
})

//Add comment
router.post('/api/trips/:tripID/comments', async (req: Request, res: Response) => {
    const { message } = req.body;
    try {
        const token = req.headers.authorization?.substr(7)
        const decoded = jwt.verify(token as string, "secret") as JWT;
        const trip = await Trip.findById(req.params.tripID);
        // if (trip?.driverID != decoded.id) {
        //     return res.status(400).sendStatus(400);
        // }
        const comment = Comment.build({ message }, decoded.id, trip?.id);
        comment.save();
        trip?.comments.push(comment.id);

        await trip?.save();
    } catch (error) {
        return res.status(400).sendStatus(400);
    }
    return res.status(200).sendStatus(200);
})

//Get trip comments
router.get('/api/trips/:tripID/comments', async (req: Request, res: Response) => {
    try {
        const trip = await Trip.findById(req.params.tripID);
        if (trip) {
            const comments = Comment.find({ tripID: trip.id });
            return res.status(200).send((await comments));
        }
        return res.status(400).sendStatus(400);
    } catch (error) {
        return res.status(400).sendStatus(400);
    }
})

//Get trip passengers
router.get('/api/trips/:tripID/passengers', async (req: Request, res: Response) => {
    try {
        const trip = await Trip.findById(req.params.tripID);
        if (trip) {
            return res.status(200).send(trip.passengers);
        }
        return res.status(400).sendStatus(400);
    } catch (error) {
        return res.status(400).sendStatus(400);
    }
})

router.post('/api/trips/:tripID/passengers', async (req: Request, res: Response) => {
    try {
        var token = req.body.headers.Authorization?.substr(7)
        const decoded = jwt.verify(token as string, "secret") as JWT;
        const trip = await Trip.findById(req.params.tripID);
        if (trip) {
            trip.passengers.push({ id: decoded.id, status: PassengerStatus.PENDING });
            trip.save()
            return res.status(200).send(trip.passengers);
        }
        return res.status(400).sendStatus(400);
    } catch (error) {
        return res.status(400).sendStatus(400);
    }
})

router.get('/api/trips/:tripID/amIPassenger', async (req: Request, res: Response) => {
    try {
        const trip = await Trip.findById(req.params.tripID);
        if (trip) {
            const token = req.headers.authorization?.substr(7)
            const decoded = jwt.verify(token as string, "secret") as JWT;
            trip?.passengers.forEach(el => {
                if (el.id == decoded.id) {
                    return res.status(200).send(true);
                }
            })

            return res.status(200).send(false);
        }
        return res.status(400).sendStatus(400);
    } catch (error) {
        return res.status(400).sendStatus(400);
    }
})

//Change passenger status
router.put('/api/trips/:tripID/passengers/:passengerID', async (req: Request, res: Response) => {
    const { status } = req.body;
    try {
        const token = req.headers.authorization?.substr(7)
        const decoded = jwt.verify(token as string, "secret") as JWT;
        const trip = await Trip.findById(req.params.tripID);
        if (trip) {
            if (trip.driverID != decoded.id && PassengerStatus.CANCELED.toString() == status) {
                return res.status(400).sendStatus(400);
            }
            if (!isValidStatusForTrip) {
                return res.status(400).sendStatus(400);
            }
            const user = await User.findById(req.params.passengerID);
            if (trip.passengers.includes(user?._id)) {
                return res.status(400).sendStatus(400);
            }
            let passenger = trip.passengers.find(pass => pass.id === user?._id)

            if (PassengerStatus.ACCEPTED.toString() == status && isTripFull(trip))
                trip.status = TripStatus.BOOKED;
            else if (!isTripFull(trip) && trip.status == TripStatus.BOOKED) {
                trip.status = TripStatus.AVAILABLE;
            }
            await trip.save();
        }
    } catch (error) {
        return res.status(400).sendStatus(400);
    }
    return res.status(201).sendStatus(200);
})

//Delete trip
router.delete('/api/trips/:tripID', async (req: Request, res: Response) => {
    var decoded;
    try {
        var token = req.headers.authorization?.substr(7)
        decoded = jwt.verify(token as string, "secret") as JWT;
        const user = await User.findById(decoded.id);
        if (user?.role !== 0) {
            return res.status(400).sendStatus(400);
        }

        const trip = await Trip.findById(req.params.tripID)
        if (trip) {
            trip.deleted = true;
            await trip.save();

            const driver = await User.findById(trip.driverID);
            if (driver) {
                const index = driver.signedTrips.indexOf(trip._id, 0);
                if (index > -1) {
                    driver?.signedTrips.splice(index, 1);
                }
                await driver.save();
            }
            return res.status(204).sendStatus(204);
        }
        return res.status(400).sendStatus(400);
    } catch (error) {
        return res.status(400).sendStatus(400);
    }
})

function isValidStatusForTrip(status: string, tripStatus: TripStatus) {
    if (PassengerStatus.PENDING.toString() == status)
        return false;
    else if (PassengerStatus.ACCEPTED.toString() == status && tripStatus != TripStatus.AVAILABLE)
        return false;
    else if (PassengerStatus.REJECTED.toString() == status && !(tripStatus == TripStatus.AVAILABLE
        || tripStatus == TripStatus.BOOKED))
        return false;
    else if (PassengerStatus.CANCELED.toString() == status && !(tripStatus == TripStatus.BOOKED
        || tripStatus == TripStatus.AVAILABLE))
        return false;
    else return PassengerStatus.ABSENT.toString() != status || (tripStatus == TripStatus.DONE
        || tripStatus == TripStatus.ONGOING);
}

function isTripFull(trip: TripDoc) {
    return trip.passengers.length == trip.availablePlaces
}

export { router as TripRouter }