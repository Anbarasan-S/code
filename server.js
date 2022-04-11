const express=require('express');
const app=express();
const cors=require('cors');

require('dotenv').config();

const login=require('./routes/login');
const connection=require('./routes/connections');
const post=require('./routes/post');
const morgan = require('morgan');
(
async()=>{   
 await require('./config/db')

app.use(express.json());
app.use(cors());
app.use(morgan('common'));

app.use('/api/v1',login);
app.use('/api/v1',connection);
app.use('/api/v1/post',post);


app.listen(process.env.PORT,console.log(`💻 listening on  ${process.env.PORT}`));
})();
