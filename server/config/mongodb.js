import mongoose from "mongoose";
const connectDB= async ()=>{

    mongoose.connection.on('connected',()=>{
        console.log("db is  conected");

        

    })
    await mongoose.connect(`${process.env.MONGODB_URL}/Imagify`)
}

export default connectDB