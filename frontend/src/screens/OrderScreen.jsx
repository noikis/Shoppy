import React, { Fragment, useEffect, useState } from 'react';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2';
import axios from 'axios';

import Message from '../components/Message';
import Loader from '../components/Loader';

import {
  deliverOrder,
  getOrderDetails,
  payOrder,
} from '../actions/orderActions';
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from '../constants/orderConstants';

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, order, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  // Renaming after distructuring
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  // Calculate Prices
  const addDecimals = (num) => {
    return (Math.round(Number(num) * 100) / 100).toFixed(2);
  };

  if (!loading) {
    // TODO: Total Price 0
    order.itemsPrice = addDecimals(
      order.orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      )
    );

    order.totalPrice =
      Number(order.itemsPrice) +
      Number(order.shippingPrice) +
      Number(order.taxPrice);
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }

    // connect to the Paypal API
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;

      script.onload = () => setSdkReady(true);

      document.body.appendChild(script);
    };

    // Reset the orderDetails if order Payed
    if (!order || successPay || successDeliver) {
      // if payed it wil reload indefinitly
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPayed) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId, successPay, successDeliver, history, userInfo]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <Fragment>
      <h1>Order: {orderId}</h1>
      <Row>
        <Col md={8}>
          <ListGroup.Item>
            <h2>Shipping</h2>
            <p>
              <strong>Name:</strong> {order.user.name}
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
            </p>
            <p>
              <strong>Address:</strong> {order.shippingAddress.country},{' '}
              {order.shippingAddress.city}, {order.shippingAddress.address},{' '}
              {order.shippingAddress.postalCode}
            </p>
          </ListGroup.Item>

          <ListGroup.Item>
            <h2>Payment Method</h2>
            <p>
              <strong>Method:</strong> {order.paymentMethod}
            </p>
          </ListGroup.Item>

          <ListGroup.Item>
            <h2>Order Items</h2>
            {order.orderItems.length === 0 ? (
              <Message>Your Cart is Empty</Message>
            ) : (
              <ListGroup variant='flush'>
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} fluid rounded alt={item.name} />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={4}>
                        {item.quantity} x ${item.price} = $
                        {item.quantity * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn btn-block'
                  disabled={order.orderItems === 0}
                >
                  Order Now
                </Button>
              </ListGroup.Item>
              {!order.isPayed && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPayed &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark as Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default OrderScreen;
