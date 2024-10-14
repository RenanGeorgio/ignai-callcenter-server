import mongoose from "../../database";

const { Schema } = mongoose;

const agentSchema = new Schema({
  _id: {
    type : String,
    required : true,
    unique: true 
  },
  company: {
    type : String,
    required : true,
    unique: true 
  },
  agentName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'worker'
  },
  status: {
    type: String,
    required: true
  },
  allowedPhones: [
    {
      phoneNumber: {
        type: String
      }
    }
  ],
  allowedQueues: [
    {
      queue: {
        type : String
      }
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

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;