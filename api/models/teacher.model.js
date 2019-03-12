const mongoose = require('mongoose');


const teacherSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{type: String,required:true},
    username:{type:String,required:true},
    //dob: {type: Date,required:false},
    nid: {type: Number,required:false},
    //province:{type: String,required:false},
    //district:{type: String,required:false},
    //village:{type: String,required:false},
    //childCount:{type: Number,required:false},
    //spouse:{type: String,required:false},
    //maritalStatus:{type: String,required:false},
    avatarImage:{type:String,required:true}
    //createdAt:Date,
    //updatedAt:Date
});

teacherSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.createdAt = currentDate;
    if (!this.updatedAt)

    this.updatedAt = currentDate;
    next();

    });
    

module.exports = mongoose.model('Teachers',teacherSchema);