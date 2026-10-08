// Import mongoos
import mongoose from "mongoose";
// Import chalk
import chalk from "chalk";

// Function
const dbConnect = async () => {
  try {
    // Connect throught Env
    await mongoose.connect(process.env.MONGO_URI);
    console.log(chalk.greenBright("MongoDB connected successfully"));
  } catch (error) {
    console.error(chalk.red(`Error connecting to MongoDB: ${error.message}`));
    throw error;
  }
};

// Export dbconnect
export default dbConnect