import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import CityRow from './CityRow';
import KilometerBox from './KilometerBox';

import { getDistanceFromLatLonInKm } from '../../utiles/maps';
import { SearchCityResultModel, CityClassEnum } from '../../models/City';

import './styles.css';

type Props = {
  cityInfo: SearchCityResultModel;
};

const SearchResultDetail = ({ cityInfo }: Props) => {
  const { origin, intermediate, destination } = cityInfo;

  const originDistance = useMemo(() => {
    if (origin) {
      if (intermediate.length > 0)
        return getDistanceFromLatLonInKm(
          origin[1],
          origin[2],
          intermediate[0][1],
          intermediate[0][2]
        );
      else if (destination)
        return getDistanceFromLatLonInKm(
          origin[1],
          origin[2],
          destination[1],
          destination[2]
        );
      else return null;
    }
    return null;
  }, [origin, intermediate, destination]);

  return (
    <div className='search-result-detail-component'>
      <CityRow cityLabel={CityClassEnum.origin} cityInfo={origin} />
      <KilometerBox kiloValue={originDistance} />
      {intermediate && (
        <>
          {intermediate.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && intermediate.length > 1 && (
                <KilometerBox
                  kiloValue={getDistanceFromLatLonInKm(
                    intermediate[idx - 1][1],
                    intermediate[idx - 1][2],
                    item[1],
                    item[2]
                  )}
                />
              )}
              <CityRow cityLabel={CityClassEnum.intermediate} cityInfo={item} />
              {intermediate.length - 1 === idx && destination && (
                <KilometerBox
                  kiloValue={getDistanceFromLatLonInKm(
                    intermediate[0][1],
                    intermediate[0][2],
                    destination[1],
                    destination[2]
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </>
      )}

      <CityRow cityLabel={CityClassEnum.destination} cityInfo={destination} />
    </div>
  );
};

export default SearchResultDetail;

SearchResultDetail.prototype = {
  cityInfo: PropTypes.object,
};

SearchResultDetail.defaultProps = {
  cityInfo: {
    origin: null,
    intermediate: [],
    destination: null,
  },
};
