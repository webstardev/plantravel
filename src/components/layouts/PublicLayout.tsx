import React from 'react';
import { Container, Navbar } from 'react-bootstrap';

type Props = {
  children?: JSX.Element | JSX.Element[] | string | string[];
};

const PublicLayout = ({ children }: Props) => {
  return (
    <React.Fragment>
      <Navbar bg='primary'>
        <Container className='d-flex justify-content-center'>
          <Navbar.Brand className='text-white'>Plan Travel</Navbar.Brand>
        </Container>
      </Navbar>
      <Container fluid='sm' className='py-5'>
        {children}
      </Container>
    </React.Fragment>
  );
};

export default PublicLayout;
