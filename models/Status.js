import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const StatusSchema = new Schema({
    body:  String,
    chatName: String,
    Date : {
        type: Date,
        default : Date.now()
    }
})

const Status  = mongoose.model("Status", StatusSchema);

export default Status;
