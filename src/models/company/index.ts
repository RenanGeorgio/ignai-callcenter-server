import mongoose from "../../database";

const { Schema } = mongoose;

const companySchema = new Schema({
  company: {
    type : String,
    required : true,
    unique: true 
  },
  phoneInfo: [
    {
      phoneNumber: {
        type: String,
        required: true
      }
    }
  ],
  welcomeId: {
    type : String
  },
  menuIds: [
    {
      menuId: {
        type : String
      }
    }
  ],
  messagesIds: [
    {
      messagesId: {
        type : String
      }
    }
  ],
  queues: [
    {
      queue: {
        type : String
      }
    }
  ],
  agentIds: [
    {
      agentId: {
        type: String
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

const Company = mongoose.model('Company', companySchema);

export default Company;