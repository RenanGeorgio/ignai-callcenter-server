import mongoose from "../../database";

const { Schema } = mongoose;

const ticketSchema = new Schema({
  name: String,
  phoneNumber: String,
  description: String,
  createdAt : {
    type: Date,
    default: Date.now
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;