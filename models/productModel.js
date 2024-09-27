const mongoose = require("mongoose");
// const connectProductDB = require("../db/dbprod");

//  connectProductDB()

const productSchema = new mongoose.Schema({


  name: {
    type: String,
    required: true,
  },

  price: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: false,
  },

  images : {
    type: [String],
    required : false
  },


  category: {
    type: String,
    required: true,
  },


  quantity: {
    type: Number,
    required: true,
  },


  rating: {
    type: Number,
    required: true,
  },
},

{
    timestamps: true,
}

);




  
    
const products = mongoose.model("Product", productSchema);



module.exports = products