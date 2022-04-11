const db=async()=>{
const mongoose=require('mongoose');
    try 
    {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo Db connected successfully");
   }
    catch(err)
    {
        console.log(err);
    }
}
module.exports=db();