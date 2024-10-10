import { redisClient } from "../core/redis";

// Store the user as online with an expiration (e.g., 10 mins)
function setUserOnline(userId: string) {
  // TO-DO: trocar este tempo pro uma coisa que defina a carga horario da escala atual
  redisClient.setex(userId, 600, 'online'); // Key expires in 600 seconds (10 mins)
}

function setUserOffline(userId: string) {
  redisClient.del(userId);
}

export async function setCompanyAgents(companyId: string, queue: string, userId: string) {
  const userList: string[] = [];

  const res: string = await redisClient.hGet(companyId, queue);
  if (res) {
    const resList: string[] = res.split(" ");
    userList.push(...resList);
  }

  userList.push(userId);
  setUserOnline(userId);

  if (userList.length > 1) {
    const users = userList.join(" ");
    redisClient.hset(companyId, queue, users);
  } else {
    redisClient.hset(companyId, queue, userId);
  }

  return;
}

export async function removeCompanyAgents(companyId: string, queue: string, userId: string) {
  const userList: string[] = [];

  const res: string = await redisClient.hGet(companyId, queue);
  if (res) {
    const resList: string[] = res.split(" ");
    userList.push(...resList);
  }

  if (userList.length > 1) {
    const newUserList = userList.filter(value => value !== userId);
    const users = newUserList.join(" ");
    redisClient.hset(companyId, queue, users);
  } else {
    userList.pop();
    redisClient.hset(companyId, queue, "");
  }

  setUserOffline(userId);

  return;
}

// Retrieve the hash fields for a user
redisClient.hgetall(userId, (err, result) => {
  if (err) {
    console.error('Error fetching user data from Redis:', err);
    return;
  }

  console.log(result); // { name: 'user1', company: 'Some Company', role: 'Admin' }
});

export function checkUserOnline(userId: string, callback: any) {
  redisClient.get(userId, (err: any, result: string) => {
    if (err) {
      callback(false);
      return;
    }

    if (result === 'online') {
      callback(true);
    } else {
      callback(false);
    }
  });
}
