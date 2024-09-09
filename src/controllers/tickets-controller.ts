import { Request, Response } from "express";
import Ticket from "../models/ticket";

export const createTicket = (request: Request, response: Response) => {
  const { name, description, phone_number } = request.body;
  
  const phoneNumber = phone_number;
  var createdAt = new Date();

  if (!description || !phoneNumber || !name) {
    return response.status(400).send('name, description and phoneNumber fields are required.')
  }

  Ticket.create({ name: name, phoneNumber: phoneNumber, description: description, createdAt: createdAt })
    .then(function (savedTicket) {
      request.flash('success', 'Your ticket was submitted! An agent will call you soon.');
      return response.status(201)
        .end();
    })
    .catch(function (err) {
      request.flash('errors', 'Failed to create new ticket');
    })
}