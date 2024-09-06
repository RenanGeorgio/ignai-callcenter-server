import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URL as string);
mongoose.Promise = global.Promise;

export default mongoose;