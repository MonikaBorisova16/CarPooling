import express, { Request, Response } from 'express';
import { Car } from '../models/Car';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import JWT from '../models/JWT';
import cors from 'cors';

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

const router = express.Router()
router.use(cors(corsOptions))

//Get car by ID
router.get('/api/cars/get/:carId', async (req: Request, res: Response) => {
    const car = await Car.findById(req.params.carId);
    return res.status(200).send(car);
})

//Get all cars
router.get('/api/cars', async (req: Request, res: Response) => {
    const cars = await Car.find();
    return res.status(200).send(cars.toString());
})

//Get cars by user
router.get('/api/users/cars', async (req: Request, res: Response) => {
    var token = req.headers.authorization?.substr(7)
    const decoded = jwt.verify(token as string, "secret") as JWT;
    const cars = await Car.find({ ownerID: decoded.id , deleted: false});
    return res.status(200).send(cars);
})

//Get car images
router.get('/api/cars/:carId/images', async (req: Request, res: Response) => {
    const car = await Car.findById(req.params.carId);
    return res.status(200).send(car?.carImage);
})

//Create car
router.post('/api/cars', async (req: Request, res: Response) => {
    const { carModel, seats, airCondition, yearMade } = req.body;
    try {
        var token = req.headers.authorization?.substr(7)
        const decoded = jwt.verify(token as string, "secret") as JWT;
        const car = await Car.build({ carModel, seats, airCondition, yearMade }, decoded.id);
        const user = await User.findById(decoded.id);
        user?.ownedCars.push(car._id)
        user?.save()
        car.save();
    } catch (error) {
        return res.status(400).sendStatus(400);
    }
    return res.status(201).sendStatus(201);
})

//Edit car
router.put('/api/cars/:carID', async (req: Request, res: Response) => {
    const { carModel, seats, airCondition, yearMade } = req.body;
    var decoded;
    try {
        var token = req.headers.authorization?.substr(7)
        decoded = jwt.verify(token as string, "secret") as JWT;
    } catch (error) {
        return res.status(400).sendStatus(400);
    }
    const year = new Date().getFullYear();
    if (req.body.seats < 2) {
        return res.status(400).sendStatus(400);
    }
    if (req.body.yearMade > year) {
        return res.status(400).sendStatus(400);
    }
    var car;
    try {
        const user = await User.findById(decoded.id);
        car = await Car.findById(req.params.carID);
        if (!user?.ownedCars.includes(car?._id)) {
            return res.status(400).sendStatus(400);
        }
    } catch (error) {
        return res.status(400).sendStatus(400);
    }

    if (car != null) {
        car.carModel = carModel;
        car.seats = seats;
        car.airCondition = airCondition;
        car.yearMade = yearMade;
        await car.save();
    }
    return res.status(201).sendStatus(200);
})

//Delete car
router.delete('/api/cars/:carID', async (req: Request, res: Response) => {
    var decoded;
    try {
        var token = req.headers.authorization?.substr(7)
        decoded = jwt.verify(token as string, "secret") as JWT;
        const user = await User.findById(decoded.id);
        const car = await Car.findById(req.params.carID);
        if (!user?.ownedCars.includes(car?._id)) {
            return res.status(400).sendStatus(400);
        }
        if (car) {
            car.deleted = true;
            const index = user.ownedCars.indexOf(car._id, 0);
            if (index > -1) {
                user.ownedCars.splice(index, 1);
            }
            await user.save();
            await car?.save();
            return res.status(204).sendStatus(204);
        }
        return res.status(400).sendStatus(400);
    } catch (error) {
        return res.status(400).sendStatus(400);
    }
})

// Add car images
router.put('/api/cars/:carID/images', async (req: Request, res: Response) => {
    //TODO
})


export { router as CarRouter }