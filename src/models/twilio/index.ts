import mongoose from "../../database";

const { Schema } = mongoose;

const twilioSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    accountSid: {
        type: String,
    },
    authToken: {
        type: String,
    },
    incomingAllow: {
        type: String,
        default: "true"
    },
    callerId: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});

const Twilio = mongoose.model('Twilio', twilioSchema);

export default Twilio;