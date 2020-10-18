import React, { Fragment } from 'react';
import { Container } from 'react-bootstrap';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomeScreen from './components/screens/HomeScreen';

const App = () => {
  return (
    <Fragment>
      <Header />
      <main className='py-3'>
        <Container>
          <HomeScreen />
        </Container>
      </main>
      <Footer />
    </Fragment>
  );
};

export default App;
