const express = require('express');
const router  = express.Router();
const mongoose      = require('mongoose');

const Order = require('../models/order');
const Product = require("../models/product");

router.post('/',function(req,res,next){


  Product.findById(req.body.productId)
  .then(function(product){
    if (!product) {
    	res.status(404).json({
          message: "Product not found"
    	});
    }
  const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
   })
   .then(function(result) {
      console.log(result);
      res.status(201).json({
        message: "Created order successfully",
	        createdOrder: {
	              _id: result._id,
		          product: result.product,
		          quantity: result.quantity
		    },      
            request: {
                type: 'GET',
                url: "http://localhost:3000/orders/" + result._id
            }
      });
    })
  .catch(function(err){
      console.log(err);
      res.status(500).json({
        error: err
      });
    });  
    });  
  

module.exports = router; 