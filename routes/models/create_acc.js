const jquery = require("jquery");
const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;
const customerSchema = new Schema({
    first_name:{
        type:String,
        required:[true, "First name is required"],
        minLength:3
    },
    last_name:{
        type:String,
        required:[true, "Last name is required"],
        minLength:3
    },
    gender:{
        type: String,
        enum: ['male', 'female', 'others'],
        required : true
    },
    email:{
        type:String,
        required:[true, "Email is required"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Id")
            }
        }
    },
    phone:{
        type:Number,
        required:[true, "Phone is required"],
        min:10
    },
    acc_balance:{
        type:Number,
        required:[true, "Balance is required"],
        min:10,
        unique: false
    },
    terms:({
        works: { type: Boolean },
        asset: {
          name: String,
          type: { type: String } // works. asset is an object with a type property
        }
    }),
    created_date:{
        type:Date,
        default:Date.now
    }
})


const Customer = mongoose.model("Customer",customerSchema);



module.exports = Customer;