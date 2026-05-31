import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { connectRedis } from "./src/config/redis.js";

dotenv.config();
connectDB();

await connectRedis();

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port http://${port}`);
});