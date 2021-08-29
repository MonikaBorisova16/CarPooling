import { Indentifiable } from './Identifiable'
import mongoose from 'mongoose';

interface ICreateComment extends Indentifiable {
    message: string;
}

interface IComment extends ICreateComment {
    authorID: string;
    tripID: string;
    deleted: boolean;
}

interface commentModelInterface extends mongoose.Model<CommentDoc> {
    build(attr: ICreateComment, authorID: string, tripID: string): CommentDoc
}

interface CommentDoc extends mongoose.Document {
    message: string,
    authorID: string,
    tripID: string,
    deleted: boolean
}

const CommentSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    authorID: {
        type: String,
        required: true
    },
    tripID: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        required: true
    }
})

CommentSchema.statics.build = (attr: ICreateComment, authorID: string, tripID: string) => {
    var comment = new CommentDTO();
    if(attr.message.length < 5 || attr.message.length > 150){
        throw new Error("Comment should be between 5 and 150 symbols");
    }
    comment.message = attr.message;
    comment.authorID = authorID;
    comment.tripID = tripID;
    comment.deleted = false;

    return new Comment(comment);
}

const Comment = mongoose.model<CommentDoc, commentModelInterface>('Comment', CommentSchema);

class CommentDTO {
    public message: string;
    public authorID: string;
    public tripID: string;
    public deleted: boolean;

    constructor() {
        this.message = "";
        this.authorID = "";
        this.tripID = "";
        this.deleted = false;
    }
}

export { Comment }