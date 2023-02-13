import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import moment from 'moment';

import FullScreenLoadingSpinner from '../../components/FullScreenLoading';
import PublicLayout from '../../components/layouts/PublicLayout';
import SearchTripForm from '../../components/SearchTripForm/SearchTripForm';

import { searchTripResultAPI } from '../../apis/City';

import {
  CitySearchFormModel,
  CityClassEnum,
  SearchCityAPIModel,
} from '../../models/City';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [initialValue, setInitialValue] = useState<CitySearchFormModel>({
    origin: null,
    intermediate: [],
    destination: null,
    passenger: 1,
    tripDate: moment().add(1, 'days').toDate(),
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
        setInitialValue({
          ...res,
          passenger: searchParams.get('passenger')
            ? parseFloat(searchParams.get('passenger') as string)
            : 1,
          tripDate: searchParams.get('trip-date')
            ? moment(searchParams.get('trip-date')).toDate()
            : moment().add(1, 'days').toDate(),
        });
      })
      .catch((err) => {
        setInitialValue({
          origin: null,
          intermediate: [],
          destination: null,
          passenger: searchParams.get('passenger')
            ? parseFloat(searchParams.get('passenger') as string)
            : 1,
          tripDate: searchParams.get('trip-date')
            ? moment(searchParams.get('trip-date')).toDate()
            : moment().add(1, 'days').toDate(),
        });
        setLoading(false);
      });
  }, [searchParams]);

  return (
    <PublicLayout>
      {loading ? (
        <FullScreenLoadingSpinner />
      ) : (
        <SearchTripForm
          initialValue={initialValue}
          onSubmit={(searchUrl) => {
            navigate(searchUrl);
          }}
        />
      )}
    </PublicLayout>
  );
};

export default Home;
