import { redisClient } from "../core/redis";

// Store the user as online with an expiration (e.g., 10 mins)
function setUserOnline(userId: string) {
  // TO-DO: trocar este tempo pro uma coisa que defina a carga horario da escala atual
  redisClient.setEx(userId, 600, 'online'); // Key expires in 600 seconds (10 mins)
}

function setUserOffline(userId: string) {
  redisClient.del(userId);
}

export function setCompanyAgents(companyId: string, queues: string[], userId: string) {
  const user = userId;
  const userQueues = queues;
  const company = companyId;

  const registerAgent = async (companyName: string, queuesInfo: string[], id: string) => {
    try {
      const agentName = id;
      const qsInfo = queuesInfo;
      const comName = companyName;

      for (const qInfo in qsInfo) {
        const userList: string[] = [];
  
        const res = await redisClient.hGet(comName, qInfo);
        if (res) {
          const resList: string[] = res.split(" ");
          userList.push(...resList);
        }
  
        userList.push(agentName);
        setUserOnline(agentName);
  
        if (userList.length > 1) {
          const users = userList.join(" ");
          redisClient.hSet(comName, qInfo, users);
        } else {
          redisClient.hSet(comName, qInfo, agentName);
        }
      }

      return;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  registerAgent(company, userQueues, user);
}

export async function removeCompanyAgents(companyId: string, queue: string, userId: string) {
  const userList: string[] = [];

  const res = await redisClient.hGet(companyId, queue);
  if (res) {
    const resList: string[] = res.split(" ");
    userList.push(...resList);
  }

  if (userList.length > 1) {
    const newUserList = userList.filter(value => value !== userId);
    const users = newUserList.join(" ");
    redisClient.hSet(companyId, queue, users);
  } else {
    userList.pop();
    redisClient.hSet(companyId, queue, "");
  }

  setUserOffline(userId);

  return;
}

// Retrieve the hash fields for a user
/*redisClient.hgetall(userId, (err, result) => {
  if (err) {
    console.error('Error fetching user data from Redis:', err);
    return;
  }

  console.log(result);
});*/

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
