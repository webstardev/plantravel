import React from 'react';
import { Spinner } from 'react-bootstrap';
import './styles.css';

const FullScreenLoadingSpinner = () => {
  return (
    <div className='full-screen-loading-spinner-component'>
      <Spinner animation='border' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>
    </div>
  );
};

export default FullScreenLoadingSpinner;
