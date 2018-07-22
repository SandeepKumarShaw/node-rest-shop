const express = require('express');
const app     = express();
const morgan  = require('morgan');
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Routes which should handle request
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

mongoose.connect('mongodb://localhost/node-rest-shop');


/*app.use(function(req,res,next){
  res.status(200).json({
  	message: 'It works!'
  });
});*/

app.use(function(req,res,next){
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
app.use(function(error,req,res,next){
	res.status(error.status || 500);
	res.json({
		error:{
			message: error.message
		}
	});
});

module.exports = app;