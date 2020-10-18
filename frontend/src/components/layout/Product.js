import React from 'react';
import { Card } from 'react-bootstrap';

import Rating from './Rating';

const Product = ({ product }) => {
  const { _id, rating, image, numReviews, price, name } = product;
  return (
    <Card className='my-3 rounder'>
      <a href={`/product/${_id}`}>
        <Card.Img variant='top' src={image} />
      </a>

      <Card.Body>
        <a href={`/product/${_id}`}>
          <Card.Title as='div'>
            <strong>{name}</strong>
          </Card.Title>
        </a>

        <Card.Text as='div'>
          <Rating value={rating} text={`${numReviews} reviews`} />
        </Card.Text>
        <Card.Text as='h3'>${price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
