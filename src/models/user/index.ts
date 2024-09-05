import mongoose from "../../database";

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type : String,
        required : true 
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
    schedule: [
        {
            eventName: {
                type: String,
                required: true
            },
            companyName: {
                type: String
            },
            companyId: {
                type: String,
                required: true
            },
            jobId: {
                type: String,
                required: true
            },
            address: {
                lat: {
                    type: Number,
                    required: true
                },
                lng: {
                    type: Number,
                    required: true
                }
            },
            startAt: {
                type: Date,
                required: true
            },
            finishAt: {
                type: Date,
                required: true
            },
            registerAt: {
                type: Date,
                default: Date.now
            },   
        }
    ],
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