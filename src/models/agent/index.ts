import mongoose from "../../database";

const { Schema } = mongoose;

const agentSchema = new Schema({
  company: {
    type : String,
    required : true 
  },
  phoneNumber: {
    type: String,
    required: true
  },
  agentName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'employ'
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

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;