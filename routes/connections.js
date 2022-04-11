const router = require('express').Router();
const User = require('../models/User');
      

router.put('/:id/connection', async (req, res) => {
    try {

        if (req.body.id == req.params.id) {
            return res.status(400).json({ "msg": "You cannot connect with yourself" });
        }
        const user1 = await User.findOne({ _id: req.body.id });
        const user2 = await User.findOne({ _id: req.params.id });
        if (user1.connections.includes(req.params.id)) {
            return res.status(200).json({ "msg": "User already connected" });
        }
        if(user2.creator)
        {
            return res.status(400).json({"msg":"User is creator"});
        }
        await user1.updateOne({ $push: { connections: req.params.id } });
        await user2.updateOne({ $push: { connections: req.body.id } });
        return res.status(200).json({ "msg": "User connected successfully" });
    }
    catch (err) {
        return res.status(400).json({ "msg": "Internal server error" });
    }
});

router.put('/:id/unconnect', async (req, res) => {
    try {
        if (req.body.id == req.params.id) {
            return res.status(400).json({ "msg": "You cannot connect with yourself" });
        }
        const user1 = await User.findOne({ _id: req.body.id });
        const user2 = await User.findOne({ _id: req.params.id });
        if (!user1.connections.includes(req.params.id)) {
            return res.status(200).json({ "msg": "Connection does not exists" });
        }

        await user1.updateOne({ $pull: { connections: req.params.id } });
        await user2.updateOne({ $pull: { connections: req.body.id } });

        return res.status(200).json({ "msg": "Connection removed successfully" });

    }
    catch (err) {
        return res.status(400).json({ "msg": "Internal server error" });
    }
});

router.put('/:id/follow',async(req,res)=>{
    try {
        if (req.body.id == req.params.id) {
            return res.status(400).json({ "msg": "You cannot follow with yourself" });
        }
        const user1 = await User.findOne({ _id: req.body.id });
        const user2 = await User.findOne({ _id: req.params.id });
        if (user1.following.includes(req.params.id)&&user2.followers.includes(req.body.id)) {
            return res.status(200).json({ "msg": "The user is already followed" });
        }

        if(!user2.creator)
        {
            return res.status(400).json({"msg":"User is not a creator so  user can't be followed"});
        }
        if(!user1.following.includes(req.params.id))
        {
            await user1.updateOne({ $push: { following: req.params.id } });
        }
        if(!user2.followers.includes(req.body.id))
        {
            await user2.updateOne({ $push: { followers: req.body.id } });
        }

        return res.status(200).json({ "msg": "User followed successfully" });

    }
    catch (err) {
        console.log(err);

        return res.status(400).json({ "msg": "Internal server error" });
    }
});


router.put('/:id/unfollow', async (req, res) => {
    try {
        if (req.body.id == req.params.id) {
            return res.status(400).json({ "msg": "You cannot follow yourself" });
        }


        const user1 = await User.findOne({ _id: req.body.id });
        const user2 = await User.findOne({ _id: req.params.id });
        if (!user1.following.includes(req.params.id)) {
            return res.status(200).json({ "msg": "The user is not followed" });
        }

        await user1.updateOne({ $pull: { following: req.params.id } });
        await user2.updateOne({ $pull: { followers: req.body.id } });

        return res.status(200).json({ "msg": "Unfollowed successfully" });

    }
    catch (err) {
        return res.status(400).json({ "msg": "Internal server error" });
    }
});

router.put('/creator',async(req,res)=>{
    try
    {
        const user=await User.findOne({id:req.body.id});
        await user.updateOne({creator:true});
        return res.status(200).json({"msg":"Creator mode turned on"});
    }
    catch(err)
    {
        res.status(500).json({"msg":"Internal Server Error"});
    }
});

router.put('/creator/off',async(req,res)=>{
    try
    {
        const user=await User.findOne({id:req.body.id});
        await user.updateOne({creator:false});
        return res.status(200).json({"msg":"Creator mode turned on"});
    }
    catch(err)
    {
        res.status(500).json({"msg":"Internal Server Error"});
    }
});



module.exports = router;