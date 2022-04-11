const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
    console.log(req.headers)
    const token=req.headers['authorization'].split(' ')[1];
    console.log(token+"s");
    try{
            if(token!=null)
                {
                    const data=jwt.verify(token,process.env.JWT_TOKEN);
                    req.user=data;
                    next();
                }
                else
                {
                    return res.status(200).json({"msg":"Unauthorized please log in "});
                }
        }catch(err)
        {
            return res.status(400).json({'msg':err.message});
        }
            }      
    
// module.exports={authenticate};
