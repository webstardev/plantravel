import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import { CityModel } from '../../models/City';
import { capitalizeFirstLetter } from '../../utiles/string';

type Props = {
  cityLabel: string;
  cityInfo: CityModel | null;
};

const CityRow = ({ cityLabel, cityInfo }: Props) => {
  return (
    <>
      <div>
        <Form.Label>{capitalizeFirstLetter(cityLabel)}</Form.Label>
      </div>
      <div>{cityInfo ? capitalizeFirstLetter(cityInfo[0]) : '-'}</div>
    </>
  );
};

export default CityRow;

CityRow.prototype = {
  cityLabel: PropTypes.string,
  cityInfo: PropTypes.object,
};

CityRow.defaultProps = {
  cityLabel: '',
  cityInfo: null,
};
