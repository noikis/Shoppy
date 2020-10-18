import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Col, Row, Image, ListGroup, Button } from 'react-bootstrap';

import Rating from '../layout/Rating';

const PrductScreen = ({ match }) => {
  const [product, setProduct] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${match.params.id}`);

      setProduct(data);
    };

    fetchProduct();
  }, [match]);

  const {
    name,
    image,
    rating,
    numReviews,
    price,
    description,
    countInStock,
  } = product;
  return (
    <Fragment>
      <Link className='btn btn-outline-dark my-3' to='/'>
        <i className='fas fa-long-arrow-alt-left'></i> Go Back
      </Link>
      <Row>
        <Col md={6} className='align-center'>
          <Image src={image} alt={name} fluid />
        </Col>
        <Col md={3}>
          <ListGroup varient='flush'>
            <ListGroup.Item>
              <h3>{name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating value={rating} text={`${numReviews} reviews `} />
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Price:</strong> ${price}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Description:</strong> {description}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={3}>
          <Card>
            <ListGroup varient='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>{price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>{countInStock > 0 ? 'In Stock' : 'Out of Stock'} </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  className='btn-block '
                  type='button'
                  disabled={countInStock === 0}
                >
                  Add to Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default PrductScreen;
