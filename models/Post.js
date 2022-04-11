const mongoose=require('mongoose');
const Post=new mongoose.Schema({
   user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
   },
   caption:{
    type:String,
    max:500
   },
   img:{
       type:String
   },
   likes:[
       {
           user:{
               type:mongoose.Schema.Types.ObjectId,
               ref:'User'
           },
           
       }
   ],
   comments:[
       {
           user:{
               type:mongoose.Schema.Types.ObjectId,
               ref:'User'
           },
           comment:{
               type:String,
               required:true
           }
       }
   ]
}
);


module.exports=mongoose.model('Post',Post);