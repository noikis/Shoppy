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

export { addOrderItems };
