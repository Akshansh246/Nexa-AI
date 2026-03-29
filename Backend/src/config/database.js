import mongoose from "mongoose";


async function connectToDB() {
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected To DB")
    })
    .catch((err)=>{
        console.log("Error connecting to DB", err)
    })

}

export default connectToDB