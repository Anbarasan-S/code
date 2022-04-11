const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const struct=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:
    {
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:""
    },
    connections:{
        type:Array,
        default:[]
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    },
    creator:
    {
        type:Boolean,
        default:false
    },
},
{timestamps:true}
);

module.exports=mongoose.model('User',struct);