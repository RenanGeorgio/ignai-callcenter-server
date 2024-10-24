import { redisClient } from "../core/redis";

export async function removeUserQueue(queue: string, user: string): Promise<boolean> {
    const removed = await redisClient.sRem(queue, user)
    if (removed == 1) {
        return true
    } else {
        return false
    }
}

export async function addUserQueue(company: string) {
    const queues = await redisClient.keys(company + ':waitroom:*')
    if (queues){
        if (queues.length > 0){
            for (const queue of queues){
                const size = await redisClient.sCard(queue)
                if (size < 10){
                    const lastUser = (await redisClient.sMembers(queue)).pop()
                    if (lastUser){
                        const newUser = 'user:' + String(Number(lastUser.replace('user:', '')) + 1)
                        await redisClient.sAdd(queue, newUser)
                        return { queue, user: newUser};
                    }
                }
            }
            const lastQueue = queues.map((queue) => { return Number(queue.replace(company + ':waitroom:', '')) }).sort().pop()
            if(lastQueue){
                const newQueue = company + ':waitroom:' + String(lastQueue + 1)
                await redisClient.sAdd(newQueue, 'user:1')
                return { queue: newQueue, user: 'user:1' };
            }
        }
        else{
            await redisClient.sAdd(company + ':waitroom:1', 'user:1')
            return { queue: company + ':waitroom:1', user: 'user:1' };
        }
    } else {
        await redisClient.sAdd(company + ':waitroom:1', 'user:1')
        return { queue: company + ':waitroom:1', user: 'user:1' };
    }
}

export async function listUsersQueue(company: string) {
    const queues = await redisClient.keys(company + ':waitroom:*')
    let response: any = []
    if (queues) {
        if (queues.length > 0) {
            for (const queue of queues) {
                const members = await redisClient.sMembers(queue)
                response.push({
                    queue,
                    members
                })
            }
        }
    }
    return response
}

