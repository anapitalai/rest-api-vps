'use strict';
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const uriUtil = require('mongodb-uri');

//routes
const alumniRoutes = require('./api/routes/teachers');
const professionalRoutes = require('./api/routes/professionals');
const userRoutes = require('./api/routes/users');
const uploadRoutes = require('./api/routes/uploads');



//mongoose.connect('mongodb://localhost:27017/auth',{
//    useMongoClient:true
//});

const mongodbUri = 'mongodb://anapitalai:noGoZone@localhost:27017/education';
//const mongodbUri='mongodb://anapitalai:noGoZone19@ds127300.mlab.com:27300/nictc';
const mongooseUri = uriUtil.formatMongoose(mongodbUri);
const dbOptions = {};

mongoose.connect(mongooseUri, dbOptions, (err) => {
    if (err) {
      console.log(err);
    }
    console.log('Db started');
  });
  

const app = express();
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads')); //added sly
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next)=>{
 const allowedOrigins = ['https://tenavartovo.chervicontraining.com/teachers/', 'https://tenavartovo.chervicontraining.com/login','https://tenavartovo.chervicontraining.com/dashboard','https://api.chervicontraining.com/teachers/','http://chervicontraining.com:3000/teachers/','https://chervicontraining.com','https://tenvartovo.chervicontraining.com','http://chervicontraining.com','https://chervicontraining.com','https://api.chervicontraining.com'];
  const origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
   res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,content-type');
   res.header('Accept','application/json');
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});
 
/**app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept');
  res.header("Content-Type", "application/json");
  res.header("Accept", "application/json");
 // res.setHeader('Content-Type', null);
 // res.setHeader('Accept', "multipart/form-data");
  next();
});

**/
app.use('/teachers',alumniRoutes);
app.use('/users',userRoutes);
app.use('/professionals',professionalRoutes);
app.use('/uploads',uploadRoutes);
app.use((req,res,next)=>{
    const error = new Error("Not found");
    error.status=404;
    next(error);
});


app.use((error,req,res,next)=>{
    res.status(error.status || 500);
      res.json({
          error:{message : error.message }
   });
  });


module.exports = app;
