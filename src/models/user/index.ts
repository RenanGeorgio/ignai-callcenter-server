import mongoose from "../../database";

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    twilio: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Twilio",
        }],
        default: [],
    },
    status:{
        type: String,
        default: "ACTIVATED"
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

const User = mongoose.model('User', userSchema);

export default User;