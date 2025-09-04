import mongoose from 'mongoose';
import config from '../../config.json';

const connect = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      // already connected
      return;
    }
    
    await mongoose.connect(config.database.mongoUrl, {
      dbName: config.database.dbName,
    });
    
    console.log("MongoDB connected!");
  } catch (err) {
    console.log("mongodb connection error 😔 ", err);
    throw err;
  }
};

export default connect;
