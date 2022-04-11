const router=require('express').Router();
const Post=require('../models/Post');

router.post('/create',async(req,res)=>{
    const {id,description,img}=req.body;
    try
    {
        const post=new Post({
            user:id,
            description:description,
            img:img
        });
        await post.save();
        return res.status(200).json({"msg":"post created successfully"});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({"msg":"Internal Server Error"});
    }
});

router.post('/delete',async(req,res)=>{
    const post=await Post.findOne({_id:req.body.postId});
    try
    {
        console.log(post);
        if(!post)
        {
            return res.status(400).json({"msg":"Post not found"});
        }
        if(!(post.user.toString()==req.body.id))
        {
            return res.status(400).json({"msg":"Post not found"});
        }
        await post.deleteOne();
        res.status(200).json({"msg":"Post Deleted successfully"});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({"msg":"Internal Server Error"});
    }
});

router.get('/:id/get',async(req,res)=>{
        try
        {
            const post=await Post.findOne({_id:req.params.id});
            // userId:id,
            if(!post)
            {
                return res.status(400).json({"msg":"Post is not available"});
            }
            res.status(200).json({"msg":post});
        }
        catch(err)
        {
            console.log(err);
            res.status(500).json({"msg":"Internal Server Error"});
        }
});


router.get('/getall',async(req,res)=>{
    try
    {
        const post=await Post.find({user:req.body.id});
        if(!post)
        {
            return res.status(400).json({"msg":"Post is not available"});
        }
        res.status(200).json({"msg":post});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({"msg":"Internal Server Error"});
    }
});


router.put('/like/:id',async(req,res)=>{
    try
    {
        const post=await Post.findOne({_id:req.params.id});
        if(!post)
        {
            return res.status(404).json({"msg":"Post not found"});
        }
        if(post.likes.filter(like=>like.user.toString()===req.body.id).length>0)
        {
            return res.status(404).json({"msg":"Post already liked"});
        }
        post.likes.push({user:req.body.id});
        await post.save();
        res.status(200).json({"msg":"Post liked successfully"});
    }
    catch(err)
    {
        res.status(500).json({"msg":"Internal Server Error"});
    }
});


router.put('/like/:id/remove',async(req,res)=>{
    try
    {
        const post=await Post.findOne({_id:req.params.id});
        if(!post)
        {
            return res.status(404).json({"msg":"Post not found"});
        }
        if(post.likes.filter(like=>like.user.toString()===req.body.id).length===0)  //checks like not available
        {
            return res.status(404).json({"msg":"Post is not liked"});
        }
        await post.updateOne({$pull:{like:{user:req.body.id}}});
        res.status(200).json({"msg":"Like removed successfully"});
    }
    catch(err)
    {
        res.status(500).json({"msg":"Internal Server Error"});
    }
});

router.put('/comment/:id',async(req,res)=>{
    try
    {
        const post=await Post.findOne({_id:req.params.id});
        if(!post)
        {
            return res.status(404).json({"msg":"Post not found"});
        }
        post.comments.push({user:req.body.id,comment:req.body.comment});
        await post.save();
         res.status(200).json({"msg":"Comment has added successfully"});
    }
    catch(err)
    {
        res.status(500).json({"msg":"Internal Server Error"});
    }
});


router.put('/comment/:id/remove',async(req,res)=>{
    try
    {
        const post=await Post.findOne({_id:req.params.id});
        if(!post)
        {
            return res.status(404).json({"msg":"Post not found"});
        }
        if(post.comments.filter(comment=>comment.user.toString()===req.body.id&&comment._id.toString()===req.body.commentid).length===0)  //checks comment not available
        {
            return res.status(404).json({"msg":"Comment not found"});
        }
        await post.updateOne({$pull:{comments:{_id:req.body.commentid}}});
        res.status(200).json({"msg":"Comment removed successfully"});
    }
    catch(err)
    {
        res.status(500).json({"msg":"Internal Server Error"});
    }
});



module.exports=router;