import mongoose from "../../database";

const { Schema } = mongoose;

const welcomeSchema = new Schema({
  company: {
    type : String,
    required : true 
  },
  phoneInfo: [
    {
      phoneNumber: {
        type: String,
        required: true
      }
    }
  ],
  menu: {
    language: {
      type: String,
      required: true
    },
    numDigits: {
      type: Number,
      required: true
    },
    timeout: {
      type: Number
    },
    actionOnEmptyResult: {
      type: Boolean
    }
  },
  values: {
    language: {
      type: String,
      required: true
    },
    voice: {
      type: String
    },
    loop: {
      type: Number
    },
    messages: [
      {
        message: {
          type: String
        }
      }
    ]
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

const Welcome = mongoose.model('Welcome', welcomeSchema);

export default Welcome;