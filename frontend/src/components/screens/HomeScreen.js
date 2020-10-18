import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

import Product from '../layout/Product';
import { listProducts } from '../../actions/productActions';

const HomeScreen = () => {
  const dispatch = useDispatch();

  // Select a part of the store
  const productList = useSelector((state) => state.productList);
  const { products, loading, error } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <h1>Latest Products</h1>
      {loading ? (
        <h1>Loading ...</h1>
      ) : error ? (
        <h3>{error}</h3>
      ) : (
        <Row>
          {products.map((product) => (
            <Col sm='12' md='6' lg='4' key={product._id}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Fragment>
  );
};

export default HomeScreen;
