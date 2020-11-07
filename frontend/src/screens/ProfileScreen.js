import React, { useState, useEffect } from 'react';
import { Button, Col, Row, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateProfile } from '../actions/userAction';
import { listMyOrders } from '../actions/orderActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';

const ProfileScreen = ({ history }) => {
  // Local State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const orderMyList = useSelector((state) => state.orderMyList);
  const { loading: loadingOrders, error: errorOrders, orders } = orderMyList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdate);
  const { success } = userUpdateProfile;

  useEffect(() => {
    // IF NOT lOGIN
    if (!userInfo) {
      history.push('/login');
    } else {
      // GET api/users/profile
      if (!user || !user.name || success) {
        dispatch(getUserDetails('profile'));
        dispatch(listMyOrders());
        // Reset info in inputFields
        dispatch({ type: USER_UPDATE_RESET });
      } else {
        // FIll name and email
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, userInfo, history, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    // if passwords do not match
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      // Update Profile
      dispatch(updateProfile({ id: user._id, name, email, password }));
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h1>User Profile</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {success && <Message variant='success'>Profile Updated</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='email'>
            <Form.Label>Email Adress</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='password'>
            <Form.Label>Password </Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='confirmPassword'>
            <Form.Label>Password </Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            Update
          </Button>
        </Form>
      </Col>

      <Col md={9}></Col>
    </Row>
  );
};

export default ProfileScreen;
