import { ObjectID } from 'mongodb';

export type IdType = ObjectID;

export interface Indentifiable {
    _id?: IdType
}