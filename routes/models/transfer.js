const jquery = require("jquery");
const mongoose = require("mongoose");
const validator = require("validator");

const transactionSchema = new mongoose.Schema({
    transferFrom: {
        type:String,
        required:true,
        minLength:3
    },
    transferTo: {
        type:String,
        required:true,
        minLength:3
    },
    amount:{
        type:Number,
        required:true,
        min:10,
        unique: false
    },
    transfered_date:{
        type:Date,
        default:Date.now
    }
})


const Transaction = mongoose.model("Transaction",transactionSchema);

module.exports = Transaction;