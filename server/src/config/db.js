import mongoose from "mongoose";

// const connectDB = async () => {
//     try {
//         await mongoose.connect(
//             process.env.MONGO_URI
//         );
//         console.log("MongoDB Connected");

//     }
//     catch(error){
//         console.log(error);
//         process.exit(1);
//     }
// };

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {console.log("Database connected successfully!")})
        let mongodbURI = process.env.MONGO_URI;
        const project_name ="auth-system";

        if(!mongodbURI){
            throw new Error("MONGODB_URI environment variable not set");
        }
        
        if(mongodbURI.endsWith('/')){
            mongodbURI = mongodbURI.slice(0,-1)
        }
        await mongoose.connect(`${mongodbURI}/${project_name}`);
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
        process.exit(1)
    }
}
export default connectDB;