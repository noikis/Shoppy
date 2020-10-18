import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';

import productRoutes from './routes/productRoutes.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const app = express();

app.get('/', (req, res) => {
  res.send('API is Running');
});

app.use('/api/products', productRoutes);

// Middleware
// @desc Overwrite Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
