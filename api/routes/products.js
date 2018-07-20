const express = require('express');
const router  = express.Router();
const mongoose      = require('mongoose');

const Product = require('../models/product');

router.get('/',function(req,res,next){
	Product.find()
	.select('name price _id')
	.exec()
	.then(function(docs){
		const response = {
			count: docs.length,
			products:docs.map(function(doc){
              return {
              	name: doc.name,
	            price: doc.price,
	            _id: doc._id,
	            request: {
	              type: "GET",
	              url: "http://localhost:3000/products/" + doc._id
	            }  
              };
			})
		};
		res.status(200).json(response);
	})
	.catch(function(err){
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post('/',function(req,res,next){
  const product = new Product({
  	_id:new mongoose.Types.ObjectId(),
	name:req.body.name,
  	price:req.body.price
  });
  product
    .save()
    .then(function(result) {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
                type: 'GET',
                url: "http://localhost:3000/products/" + result._id
            }
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

router.get('/:productId',function(req,res,next){
	const id = req.params.productId;
	Product.findById(id)
	.select('name price _id')
	.exec()
	.then(function(doc){
	  console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            product: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products'
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
});

router.patch('/:productId',function(req,res,next){
	const id = req.params.productId;
	const updateOps = {};
	for(const ops of req.body){
		updateOps[ops.propName] = ops.value;
	}
	Product.update({ _id: id},{$set:updateOps})
	.exec()
	.then(function(result){
        res.status(200).json({
          message: 'Product updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + id
          }
      });
	})
	.catch(function(err){
      console.log(err);
      res.status(500).json({
        error: err
      });
    });  

	/*[
  	  {"propName":"name", "value":"sandy"},
	  {"propName":"price", "value":"22"}
	]*/
});

router.delete('/:productId',function(req,res,next){
	const id = req.params.productId;
	Product.remove({ _id: id})
	.exec()
	.then(function(result){
		res.status(200).json({
          message: 'Product deleted',
          request: {
              type: 'POST',
              url: 'http://localhost:3000/products',
              body: { name: 'String', price: 'Number' }
          }
      });
	})
	.catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;