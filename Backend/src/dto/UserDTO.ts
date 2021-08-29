export interface User {
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    avatarUri: string
}

export class UserDTO implements User {
    public id: string;
    public username: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public phone: string;
    public avatarUri: string;
   
    constructor() {
        this.id = "";
        this.username = "";
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.phone = "",
        this.avatarUri = "";

    }
}

export enum PassengerSatus {
    PENDING, ACCEPTED, REJECTED, CANCELED, ABSENT
}

export class PassengerDTO implements User {
    constructor(
        public id: string,
        public username: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public phone: string,
        public avatarUri: string,
        public passengerStatus: PassengerSatus
    ) {}

}