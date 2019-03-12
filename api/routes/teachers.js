const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const uriUtil = require('mongodb-uri');
//const multer =require('multer');
const checkAuth = require('../middleware/check-auth');
//multer from here
const multer = require('multer');

const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){
        cb(null,new Date().toISOString()+file.originalname);
    }
});
const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
};
const upload = multer({storage:storage,limit:{
    fileSize:1024 * 1024 * 5
},
fileFilter:fileFilter
}); 


//multer to here

const Teacher = require('../models/teacher.model');


//get all alumni routes
router.get('/',(req,res,next)=>{
 Teacher.find()
 .select('_id  name username nid avatarImage createdAt updatedAt')
 .exec()
 .then(doc=>{

  ///** 
    console.log(doc);
    const response={
        count:doc.length,
        teachers:doc.map(docs=>
           {
                
            return {
                id:docs._id,
                name:docs.name,
                username:docs.username,
                //dob:docs.dob,
                nid:docs.nid,
                //province:docs.province,
                //district:docs.district,
                //village:docs.village,
                //childCount:docs.childCount,
                //spouse:docs.spouse,
                //maritalStatus:doc.maritalStatus,
                //avatarImage:doc.avatarImage,
                updatedAt:doc.updatedAt,
                createdAt:doc.createdAt,
                avatarImage:'http://localhost:3007/'+docs.avatarImage,
            request:{
              type:'GET',
              url:'http://localhost:3007/teachers/' + docs._id
            },
            requestAvatar:{
                type:'GET',
                url:'http://localhost:3007/' + docs.avatarImage
              }
            }
            }
    )}
    ;
    
   // **/

    res.status(200).json(response); //change back to docs
})
 .catch(err=>{
     console.log(err);
     res.status(500).json({error:err});
 });
});

//add a new alumni route
  // router.post('/',upload.array("uploads[]",12),(req,res,next)=>{
    router.post('/',upload.single('avatarImage'),(req,res,next)=>{
    const teacher = new Teacher({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        username:req.body.username,
        //dob: req.body.dob,
        nid: req.body.nid,
        //province:req.body.province,
        //district:req.body.district,
        //village:req.body.village,
        //childCount:req.body.childCount,
        //spouse:req.body.spouse,
        //maritalStatus:req.body.maritalStatus,
        avatarImage:req.file.path

    }); 
    teacher
    .save()
    .then((teacherData)=>{
        console.log(teacherData);
        res.status(201).json({
            message:'New Profile created',
            createdTeacher:teacherData
           });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });


});

/**router.post('/',(req,res)=>{
    const teacher = new Teacher(req.body);
    teacher.save((err,teacher)=>{
      if(err){
          res.status(400).json(err);
      }
      res.json(teacher);
    });
});**/


//get single alumni route
router.get('/:memberId',(req,res,next)=>{
    const id=req.params.memberId;
    Teacher.findById(id)
    .select('_id name username nid avatarImage')
    .exec()
    .then(doc=>{
       console.log('From DB',doc);
       if(doc){
        res.status(200).json(doc);
       }
        else{
            res.status(400).json({
                message:'No valid member for the given ID'
            });
        }
      
   })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
   });


//update route
/**router.patch('/:memberId',(req,res,next)=>{
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    const id=req.params.memberId;
    Teacher.update({_id:id},{$set:updateOps})
    .exec()
    .then(result=>{
       res.status(200).json(result);
   })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
   });**/

   router.put('/:memberId',(req,res)=>{
    const _id = req.params.memberId;

    Teacher.findOneAndUpdate({ _id },
      req.body,
      { new: true },
      (err, user) => {
      if (err) {
         res.status(400).json(err);
      }
       res.json(user);
    });
    });





//delete route

router.delete('/:memberId',(req,res,next)=>{
    const id=req.params.memberId;
    Teacher.deleteOne({_id:id})
    .exec()
    .then(result=>{
       res.status(200).json(result);
   })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
   });


module.exports = router;