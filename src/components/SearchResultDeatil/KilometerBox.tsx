import React from 'react';
import PropTypes from 'prop-types';

type Props = {
  kiloValue: number | null;
};

const KilometerBox = ({ kiloValue }: Props) => {
  return (
    <>
      <div className='kilo-box-component d-flex flex-column justify-content-center position-relative align-items-center'></div>
      <div className='d-flex align-items-center'>
        {kiloValue ? `${Number(kiloValue).toFixed(2)} km` : '-'}
      </div>
    </>
  );
};

export default KilometerBox;

KilometerBox.propTypes = {
  kiloValue: PropTypes.number || null,
};

KilometerBox.defaultProps = {
  kiloValue: 0,
};
