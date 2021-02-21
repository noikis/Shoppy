import asyncHandler from 'express-async-handler';

import Order from '../models/orderModel.js';

// @desc Create new Order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    shippingPrice,
    taxPrice,
    TotalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      taxPrice,
      TotalPrice,
    });
    const createOrder = await order.save();

    res.status(201).json(createOrder);
  }
});

// @desc Get order By ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc Update order to paid
// @route GET /api/orders/:id/pay
// @access Private
const updateOrderToPayed = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPayed = true;
    order.payedAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc Update order to deliver
// @route GET /api/orders/:id/deliver
// @access Private
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.DeliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc Get order of the logged in user
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error('Orders not found');
  }
});

// @desc Get All Oders
// @route GET /api/orders
// @access Private
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');

  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error('Orders not found');
  }
});

export {
  addOrderItems,
  getOrderById,
  getMyOrders,
  updateOrderToPayed,
  updateOrderToDelivered,
  getOrders,
};
