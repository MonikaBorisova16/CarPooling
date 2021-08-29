import { Indentifiable } from './Identifiable';
import mongoose from 'mongoose';

interface IBaseUser extends Indentifiable {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface ICreateUser extends IBaseUser {
    password: string;
}

interface IUser extends IBaseUser {
    avatar: string;
}

interface userModelInterface extends mongoose.Model<UserDoc> {
    build(attr: ICreateUser): UserDoc
}

interface userDetailsModelInterface extends mongoose.Model<UserDetailsDoc> {
    build(attr: ICreateUser): UserDetailsDoc
}

interface UserDoc extends mongoose.Document {
    username: string,
    password: string,
    phone: string,
    userDetailsID: string,
    enabled: boolean,
    ownedCars: Array<String>,
    signedTrips: Array<String>,
    role: UserRole
}

interface UserDetailsDoc extends mongoose.Document {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    avatar: string;
}

enum UserRole {
    ROLE_ADMIN, ROLE_CLIENT
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true
    },
    role: {
        type: UserRole,
        required: true
    },
    userDetailsID: {
        type: String,
        required: true
    },
    signedTrips: {
        type: Array,
        required: true
    },
    ownedCars: {
        type: Array,
        required: true
    }
})

const UserDetailsSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    }
})

UserSchema.statics.build = (attr: ICreateUser) => {
    var user = new UserDTO();
    if (attr.username.length < 4) {
        throw new Error("Username should be at least 4 symbols!");
    }
    user.username = attr.username;
    user.password = attr.password;
    const userDetails = UserDetails.build(attr);
    userDetails.save();
    user.userDetailsID = userDetails._id;
    user.role = UserRole.ROLE_CLIENT;
    user.enabled = true;
    user.ownedCars = new Array<String>();
    user.signedTrips = new Array<String>();
    return new User(user)
}

UserDetailsSchema.statics.build = (attr: ICreateUser) => {
    var details = new UserDetailsDTO();

    if (attr.firstName.length < 2)
        throw new Error("First name should be at least 2 symbols!");
    if (attr.lastName.length < 2)
        throw new Error("Last name should be at least 2 symbols!");
    details.email = attr.email;
    details.firstName = attr.firstName;
    details.lastName = attr.lastName;
    if (!isValidPhoneNumber(attr.phone)) throw new Error("invalid phone number");
    details.phone = attr.phone;
    //TODO set default picture
    details.avatar = "avatar"
    return new UserDetails(details)
}

function isValidPhoneNumber(phoneNumber: String) {
    if (!phoneNumber.match("^[0-9+]+$")) return false;
    if (phoneNumber.startsWith("08") && phoneNumber.length == 10)
        return true;
    if (phoneNumber.startsWith("+3598") && phoneNumber.length == 13)
        return true;
    return false;
}

const User = mongoose.model<UserDoc, userModelInterface>('User', UserSchema);
const UserDetails = mongoose.model<UserDetailsDoc, userDetailsModelInterface>('UserDetails', UserDetailsSchema);

class UserDTO {
    public username: string;
    public password: string;
    public enabled: boolean;
    public role: UserRole;
    public userDetailsID: string;
    public ownedCars: Array<String>;
    public signedTrips: Array<String>;

    constructor() {
        this.username = "";
        this.password = "";
        this.enabled = false,
            this.role = UserRole.ROLE_CLIENT,
            this.userDetailsID = "";
        this.ownedCars = new Array<String>();
        this.signedTrips = new Array<String>();
    }
}

class UserDetailsDTO {

    public email: string;
    public firstName: string;
    public lastName: string;
    public phone: string;
    public avatar: string;

    constructor() {
        this.email = "";
        this.firstName = "";
        this.lastName = "";
        this.phone = "";
        this.avatar = "";
    }
}

export { User, UserDetails, UserRole }
