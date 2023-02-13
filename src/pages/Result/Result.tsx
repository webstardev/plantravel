import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import PublicLayout from '../../components/layouts/PublicLayout';
import SearchResultDetail from '../../components/SearchResultDeatil/SearchResultDetail';
import {
  SearchCityResultModel,
  CityClassEnum,
  SearchCityAPIModel,
} from '../../models/City';
import { getTotalDistance } from '../../utiles/maps';
import { searchTripResultAPI } from '../../apis/City';
import FullScreenLoadingSpinner from '../../components/FullScreenLoading';

const Result = () => {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [tripCities, setTripCities] = useState<SearchCityResultModel>({
    origin: null,
    intermediate: [],
    destination: null,
  });

  useEffect(() => {
    setLoading(true);
    const searchCityData: SearchCityAPIModel = {
      origin: null,
      intermediate: [],
      destination: null,
    };

    Object.keys(CityClassEnum).forEach((item) => {
      const findOne = searchParams.get(
        CityClassEnum[item as keyof typeof CityClassEnum]
      );
      if (findOne) {
        if (
          CityClassEnum[item as keyof typeof CityClassEnum] ===
          CityClassEnum.intermediate
        )
          searchCityData.intermediate = findOne.split(',');
        else {
          // @ts-ignore: Unreachable code error
          searchCityData[item as keyof typeof RESLUT_CITY_INFO] = findOne;
        }
      }
    });

    searchTripResultAPI(searchCityData)
      .then((res) => {
        setLoading(false);
        setTripCities(res);
      })
      .catch((err) => {
        setTripCities({
          origin: null,
          intermediate: [],
          destination: null,
        });
        setLoading(false);
      });
  }, [searchParams]);

  return (
    <PublicLayout>
      {loading ? (
        <FullScreenLoadingSpinner />
      ) : (
        <>
          <Table bordered>
            <thead>
              <tr>
                <th className='text-capitalize'>
                  City of {CityClassEnum.origin}
                </th>
                <th className='text-capitalize'>
                  City of {CityClassEnum.destination}
                </th>
                <th className='text-capitalize'>Passengers</th>
                <th className='text-capitalize'>Date of the trip</th>
                <th className='text-capitalize'>Total Distance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{tripCities.origin && tripCities.origin[0]}</td>
                <td>{tripCities.destination && tripCities.destination[0]}</td>
                <td>{searchParams.get('passenger')}</td>
                <td>{searchParams.get('trip-date')}</td>
                <td>{Number(getTotalDistance(tripCities)).toFixed(2)} km</td>
              </tr>
            </tbody>
          </Table>
          <SearchResultDetail cityInfo={tripCities} />
        </>
      )}
    </PublicLayout>
  );
};

export default Result;
