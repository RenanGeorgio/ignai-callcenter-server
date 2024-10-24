import { redisClient } from "../core/redis";

export async function removeUserQueue(queue: string, user: string): Promise<boolean> {
    const removed = await redisClient.sRem(queue, user);

    if (removed == 1) {
        return true;
    } else {
        return false;
    }
}

export async function addUserQueue(company: string, queueName: string) {
    const queues = await redisClient.keys(company + ':' + queueName + ':*');

    if (queues) {
        if (queues.length > 0) {
            for (const queue of queues) {
                const size = await redisClient.sCard(queue);

                if (size < 10) {
                    const lastUser = (await redisClient.sMembers(queue)).pop();

                    if (lastUser) {
                        const newUser = 'user:' + String(Number(lastUser.replace('user:', '')) + 1);
                        await redisClient.sAdd(queue, newUser);

                        return { queue, user: newUser};
                    }
                }
            }

            const lastQueue = queues.map((queue) => { return Number(queue.replace(company + ':' + queueName + ':', '')) }).sort().pop();

            if (lastQueue) {
                const newQueue = company + ':' + queueName + ':' + String(lastQueue + 1);
                await redisClient.sAdd(newQueue, 'user:1');

                return { queue: newQueue, user: 'user:1' };
            }
        } else {
            await redisClient.sAdd(company + ':' + queueName + ':1', 'user:1');

            return { queue: company + ':' + queueName + ':1', user: 'user:1' };
        }
    } else {
        await redisClient.sAdd(company + ':' + queueName + ':1', 'user:1');

        return { queue: company + ':' + queueName + ':1', user: 'user:1' };
    }
}

export async function listUsersQueue(company: string, queueName: string) {
    let response: any = [];
    const queues = await redisClient.keys(company + ':' + queueName + ':*');

    if (queues) {
        if (queues.length > 0) {
            for (const queue of queues) {
                const members = await redisClient.sMembers(queue);

                response.push({
                    queue,
                    members
                });
            }
        }
    }

    return response;
}