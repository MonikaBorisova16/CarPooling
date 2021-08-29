import { Indentifiable } from './Identifiable'
import mongoose from 'mongoose';

interface ICreateCar extends Indentifiable {
    carModel: string;
    seats: number;
    airCondition: boolean;
    yearMade: number;
}

interface ICar extends ICreateCar {
    ownerID: string;
    deleted: boolean;
    carImage: string;
}

interface carModelInterface extends mongoose.Model<CarDoc> {
    build(attr: ICreateCar, ownerID: string): CarDoc
}

interface CarDoc extends mongoose.Document {
    carModel: string,
    seats: number,
    airCondition: string,
    yearMade: number,
    ownerID: string,
    carImage: string,
    deleted: boolean
}

const CarSchema = new mongoose.Schema({
    carModel: {
        type: String,
        required: true
    },
    seats: {
        type: Number,
        required: true
    },
    airCondition: {
        type: Boolean,
        required: true
    },
    yearMade: {
        type: Number,
        required: true
    },
    ownerID: {
        type: String,
        required: true
    },
    carImage: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        required: true
    }
})

CarSchema.statics.build = (attr: ICreateCar, ownerID: string) => {
    var car = new CarDTO();
    car.carModel = attr.carModel;
    if (attr.seats < 2) {
        throw new Error("Car must have at least 2 seats");
    }
    car.seats = attr.seats;
    car.airCondition = attr.airCondition;
    const year = new Date().getFullYear();
    if (attr.yearMade > year) {
        throw new Error("Car year made cannot be bigger than current year");
    }
    car.yearMade = attr.yearMade;
    car.ownerID = ownerID;
    //TODO default image
    car.carImage = "image";
    car.deleted = false;
    return new Car(car);
}

const Car = mongoose.model<CarDoc, carModelInterface>('Car', CarSchema);

class CarDTO {
    public carModel: string;
    public seats: number;
    public airCondition: boolean;
    public yearMade: number;
    public ownerID: string;
    public carImage: string;
    public deleted: boolean;

    constructor() {
        this.carModel = "";
        this.seats = 0;
        this.airCondition = false;
        this.yearMade = 0;
        this.ownerID = "";
        this.carImage = "";
        this.deleted = false;
    }
}

export { Car }