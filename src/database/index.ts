import mongoose from "mongoose";
import config from "../config/env";

// Connect to MongoDB (make sure you include the replica set in the URI)
// 'mongodb://localhost:27017/your-db?replicaSet=rs0'

const url: string = config.app.database;

(async () => {
  await mongoose.connect(url).then(() => { 
    console.log("Database connected!") 
  }).catch((err: any) => { 
    console.log(err.message) 
  });
  mongoose.Promise = global.Promise;
})();

export default mongoose;
