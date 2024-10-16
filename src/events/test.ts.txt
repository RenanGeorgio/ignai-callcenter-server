const express = require('express');
const redis = require('redis');
const app = express();

// Redis setup
const redisPublisher = redis.createClient();
const redisSubscriber = redis.createClient();

const subscribers = {};

// SSE subscription
app.get('/events', (req, res) => {
  const userId = req.query.userId;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  subscribers[userId] = res;

  // Remove subscriber when connection closes
  req.on('close', () => {
    delete subscribers[userId];
  });
});

// Subscribe to Redis channel
redisSubscriber.subscribe('user_updates');

redisSubscriber.on('message', (channel, message) => {
  const eventData = JSON.parse(message);
  const userId = eventData.userId;

  // Send event only to the user with matching userId
  if (subscribers[userId]) {
    subscribers[userId].write(`data: ${JSON.stringify(eventData)}\n\n`);
  }
});

// Example of publishing an event
app.post('/trigger-event', (req, res) => {
  const eventData = { userId: req.body.userId, message: 'Condition met!' };
  redisPublisher.publish('user_updates', JSON.stringify(eventData));
  res.send('Event triggered');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
