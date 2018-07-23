const express = require('express');
const router  = express.Router();

const Order = require('../models/order');
const Product = require("../models/product");

const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

// Handle incoming GET/POST requests to /orders

router.get('/',OrdersController.orders_get_all);

router.post('/', checkAuth, OrdersController.orders_create_order);  

router.get('/:orderId', OrdersController.orders_get_order);

router.delete("/:orderId", checkAuth, OrdersController.orders_delete_order);
  

module.exports = router; 