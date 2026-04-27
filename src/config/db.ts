import mongoose from "mongoose";
import config from ".";

declare global {
  var mongooseConnectionPromise: Promise<typeof mongoose> | undefined;
}

const connectDB = async () => {
  if (!config.db_url) {
    throw new Error("DB_URL is not defined");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (mongoose.connection.readyState === 2) {
    if (!global.mongooseConnectionPromise) {
      global.mongooseConnectionPromise = mongoose.connect(config.db_url);
    }
  } else {
    global.mongooseConnectionPromise = mongoose.connect(config.db_url);
  }

  try {
    await global.mongooseConnectionPromise;
    return mongoose;
  } catch (error) {
    global.mongooseConnectionPromise = undefined;
    throw error;
  }
};

export default connectDB;
