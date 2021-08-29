import { Indentifiable } from './Identifiable'
import mongoose from 'mongoose';

interface ICreateTrip extends Indentifiable {
    carID: string;
    message: string;
    departureTime: string;
    origin: string;
    destination: string;
    allowsSmoking: boolean;
    allowsPets: boolean;
    allowsLuggage: boolean;
    availablePlaces: number;
}

interface ITrip extends ICreateTrip {
    status: TripStatus;
    deleted: boolean;
    driverID: string;
    passengers: Array<Passenger>;
    comments: Array<String>;
}

interface Passenger {
    id: string;
    status: PassengerStatus;
}

enum PassengerStatus {
    PENDING, ACCEPTED, REJECTED, CANCELED, ABSENT
}

enum TripStatus {
    AVAILABLE, BOOKED, ONGOING, DONE, CANCELED
}

export function getTripStatusValue(value: string) {
    if (value == TripStatus.AVAILABLE.toString()) {
        return TripStatus.AVAILABLE
    }
    else if (value == TripStatus.BOOKED.toString()) {
        return TripStatus.BOOKED
    }
    else if (value == TripStatus.ONGOING.toString()) {
        return TripStatus.ONGOING
    }
    else if (value == TripStatus.DONE.toString()) {
        return TripStatus.DONE
    }
    else if (value == TripStatus.CANCELED.toString()) {
        return TripStatus.CANCELED
    }
    throw new Error("Not valid value");
}

interface tripModelInterface extends mongoose.Model<TripDoc> {
    build(attr: ICreateTrip, ownerID: string, driverFirstName: string, driverLastName: string, driverUsername: string): TripDoc
}

interface TripDoc extends mongoose.Document {
    status: TripStatus;
    carID: string;
    message: string;
    departureTime: string;
    origin: string;
    destination: string;
    availablePlaces: number;
    allowsSmoking: boolean;
    allowsPets: boolean;
    allowsLuggage: boolean;
    driverID: string;
    driverFirstName: string;
    driverLasttName: string;
    passengers: Array<Passenger>;
    comments: Array<String>;
    deleted: boolean;
}

const TripSchema = new mongoose.Schema({
    carID: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    departureTime: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    availablePlaces: {
        type: Number,
        required: true
    },
    allowsSmoking: {
        type: Boolean,
        required: true
    },
    allowsPets: {
        type: Boolean,
        required: true
    },
    allowsLuggage: {
        type: Boolean,
        required: true
    },
    status: {
        //TODO ADD type
        type: TripStatus,
        required: true
    },
    deleted: {
        type: Boolean,
        required: true
    },
    driverID: {
        type: String,
        required: true
    },
    driverFirstName: {
        type: String,
        required: true
    },
    driverLastName: {
        type: String,
        required: true
    },
    driverUsername: {
        type: String,
        required: true
    },
    passengers: {
        //TODO ADD type
        type: Array,
        required: true
    },
    comments: {
        //TODO ADD type
        type: Array,
        required: true
    }

})

TripSchema.statics.build = (attr: ICreateTrip, ownerID: string, driverFirstName: string, driverLastName: string, driverUsername: string) => {
    var trip = new TripDTO();
    trip.carID = attr.carID;
    trip.message = attr.message;
    trip.departureTime = attr.departureTime;
    trip.origin = attr.origin;
    trip.destination = attr.destination;
    trip.availablePlaces = attr.availablePlaces;
    trip.allowsSmoking = attr.allowsSmoking;
    trip.allowsPets = attr.allowsPets;
    trip.allowsLuggage = attr.allowsLuggage;
    trip.driverID = ownerID;
    trip.driverFirstName = driverFirstName;
    trip.driverLastName = driverLastName;
    trip.driverUsername = driverUsername;
    trip.deleted = false;

    return new Trip(trip);
}

const Trip = mongoose.model<TripDoc, tripModelInterface>('Trip', TripSchema);

class TripDTO {
    public carID: string;
    public message: string;
    public departureTime: string;
    public origin: string;
    public destination: string;
    public availablePlaces: number;
    public allowsSmoking: boolean;
    public allowsPets: boolean;
    public allowsLuggage: boolean;
    public driverID: string;
    public driverFirstName: string;
    public driverLastName: string;
    public driverUsername: string;
    public status: TripStatus;
    public deleted: boolean;
    public passengers: Array<Passenger>;
    public comments: Array<String>;

    constructor() {
        this.carID = "";
        this.message = "";
        this.departureTime = "";
        this.origin = "";
        this.destination = "";
        this.availablePlaces = 0;
        this.allowsSmoking = false;
        this.allowsPets = false;
        this.allowsLuggage = false;
        this.driverID = "";
        this.driverFirstName = "";
        this.driverLastName = "";
        this.driverUsername = "";
        this.status = TripStatus.AVAILABLE;
        this.deleted = false;
        this.passengers = new Array<Passenger>();
        this.comments = new Array<String>();
    }
}

export { Trip, TripStatus, TripDoc, PassengerStatus }