import React, { useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { getCityAPI } from '../apis/City';
import { CityModel } from '../models/City';

interface SELECT_ITEM {
  label: string;
  lat: number;
  long: number;
}

const CitySelect = ({ city, onChangeCity, invalid = false, ...props }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<Array<SELECT_ITEM>>([]);

  const loadCity = (query: string) => {
    setIsLoading(true);
    getCityAPI(query)
      .then((res) => {
        setIsLoading(false);
        setOptions([
          ...res.map((item) => ({
            label: item[0],
            lat: item[1],
            long: item[2],
          })),
        ]);
      })
      .catch((err) => {
        setIsLoading(false);
        setOptions([]);
      });
  };

  return (
    <AsyncTypeahead
      id={props.id}
      className={`flex-grow-1 ${invalid ? 'invalide-form' : ''}`}
      isLoading={isLoading}
      placeholder='Search Cities'
      promptText='Searching'
      searchText='Searching'
      emptyLabel='There is no matched city'
      minLength={1}
      defaultSelected={
        city ? [{ label: city[0], lat: city[1], long: city[2] }] : []
      }
      options={options}
      onSearch={loadCity}
      onChange={(newCity: SELECT_ITEM[]) => {
        if (newCity.length > 0)
          onChangeCity([newCity[0].label, newCity[0].lat, newCity[0].long]);
        else onChangeCity(null);
      }}
      labelKey={'label'}
      renderMenuItemChildren={(option: SELECT_ITEM) => (
        <div>{option.label}</div>
      )}
      {...props}
    />
  );
};

export default CitySelect;

CitySelect.defaultProps = {
  id: new Date().toString(),
  city: null,
  onChangeCity: (city: CityModel | null) => {},
  invaild: false,
};
