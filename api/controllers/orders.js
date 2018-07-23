const mongoose      = require('mongoose');

const Order = require('../models/order');
const Product = require("../models/product");

exports.orders_get_all = function(req,res,next){
  Order.find()
  .select('product quantity _id')
  .populate('product','name')
  .exec()
  .then(function(docs){    
    res.status(200).json({
            count: docs.length,
      order:docs.map(function(doc){
              return {
                quantity: doc.quantity,
                product: doc.product,
                _id: doc._id,
                request: {
                  type: "GET",
                  url: "http://localhost:3000/orders/" + doc._id
                }  
              };
      })
    });
  })
  .catch(function(err){
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.orders_create_order = function(req,res,next){
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
};

exports.orders_get_order = function(req,res,next){
  const id = req.params.orderId;
  Order.findById(id)
  .select('product quantity _id')
  .populate('product','name')
  .exec()
  .then(function(doc){
    console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            order: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
  })
  .catch(function(err){
      console.log(err);
      res.status(500).json({
        error: err
      });
    });  
};

exports.orders_delete_order = function(req,res,next){
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(function(result){
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders",
          body: { productId: "ID", quantity: "Number" }
        }
      });
    })
    .catch(function(err){
      console.log(err);
      res.status(500).json({
        error: err
      });
    });  
};