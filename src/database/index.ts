import mongoose from "mongoose";
import config from "../config/env";

const url: string = config.app.database;

(async () => {
  await mongoose.connect(url, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,      
    }
  ).then(() => { 
    console.log("Database connected!") 
  }).catch((err: any) => { 
    console.log(err.message) 
  });

  mongoose.Promise = global.Promise;
})();

export default mongoose;