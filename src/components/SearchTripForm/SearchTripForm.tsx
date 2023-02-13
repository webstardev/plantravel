import React from 'react';
import { Formik, Form as FormikForm, FieldArray } from 'formik';
import moment from 'moment';
import { Form, Row, Col, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CitySelect from '../../components/CitySelect';
import { TrashIcon } from '@heroicons/react/24/outline';

import {
  searchCityValidateSchema,
  validateNearbyDuplicate,
} from '../../utiles/validates';
import {
  CityModel,
  CityClassEnum,
  CitySearchFormModel,
} from '../../models/City';

type Props = {
  initialValue: CitySearchFormModel;
  onSubmit: (searchUrl: string) => void;
};

const SearchTripForm = ({ initialValue, onSubmit }: Props) => {
  const getInterCityValid = (
    touched: boolean | undefined | Array<boolean | null>,
    errors: string | undefined | Array<string | null>,
    idx: number
  ): boolean => {
    // @ts-ignore: Unreachable code error
    if (typeof touched === 'object' && typeof errors === 'object') {
      // @ts-ignore: Unreachable code error
      if (
        (touched as Array<boolean | null>)[idx] &&
        (errors as Array<string | null>)[idx]
      )
        return true;
      else return false;
    }

    return false;
  };

  const checkCityNearbyDuplicate = (
    newValue: any,
    values: any,
    setFieldError: any
  ) => {
    setTimeout(() => {
      if (!validateNearbyDuplicate(newValue, values)) {
        setFieldError(
          newValue.field === 'intermediate'
            ? `intermediate[${newValue.idx}]`
            : newValue.field,
          'City should not be same as previous or next one'
        );
      }
    }, 0);
  };

  const handleChangeCitySelect = (
    fieldName: string,
    newValue: any,
    values: any,
    setFieldValue: any,
    setFieldErorr: any,
    idx: number = 0
  ) => {
    if (fieldName === 'intermediate') {
      const newInterCity = values.intermediate.map(
        (itemOne: CityModel | null, idxOne: number) => {
          if (idx === idxOne) return newValue;
          else return itemOne;
        }
      );
      setFieldValue('intermediate', newInterCity);
    } else setFieldValue(fieldName, newValue);

    if (newValue)
      checkCityNearbyDuplicate(
        {
          value: newValue,
          field: fieldName,
          idx,
        },
        values,
        setFieldErorr
      );
  };

  const handleBlurCitySelect = (
    fieldName: string,
    values: any,
    setFieldTouched: any,
    setFieldErorr: any,
    idx: number = 0
  ) => {
    setFieldTouched(
      fieldName === 'intermediate' ? `intermediate[${idx}]` : fieldName,
      true
    );

    let fieldValue;
    if (fieldName === 'intermediate') fieldValue = values.intermediate[idx];
    else fieldValue = values[fieldName as keyof typeof values];

    if (fieldValue)
      checkCityNearbyDuplicate(
        {
          value: fieldValue,
          field: fieldName,
          idx,
        },
        values,
        setFieldErorr
      );
  };

  const submitBtnStates = (errors: any): boolean => {
    if (
      errors.origin ||
      errors.destination ||
      errors.passenger ||
      errors.tripDate
    )
      return true;

    if (errors.intermediate) {
      for (let i = 0; i < errors.intermediate.length; i++)
        if (errors.intermediate[i]) return false;
    }
    return false;
  };

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={searchCityValidateSchema}
      onSubmit={(values, errors) => {
        if (submitBtnStates(errors)) return;
        if (values.origin && values.destination) {
          const interCites: string[] = [];

          if (values.intermediate.length > 0)
            values.intermediate.forEach((item) => {
              if (item && item.length > 0) interCites.push(item[0]);
            });

          let searchUrl = `/search?${CityClassEnum.origin}=${values.origin[0]}`;
          if (interCites.length > 0)
            searchUrl += `&${CityClassEnum.intermediate}=${interCites.join(
              ','
            )}`;
          searchUrl += `&${CityClassEnum.destination}=${values.destination[0]}`;
          searchUrl += `&passenger=${values.passenger}`;
          searchUrl += `&trip-date=${moment(values.tripDate).format(
            'YYYY-MM-DD'
          )}`;
          onSubmit(searchUrl);
        }
      }}
      render={({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setValues,
        setFieldValue,
        setFieldTouched,
        setFieldError,
      }) => (
        <FormikForm>
          <Form.Group className='mb-3'>
            <Form.Label className='text-capitalize'>
              City of {CityClassEnum.origin}
            </Form.Label>
            <CitySelect
              id='origin'
              name='origin'
              city={values.origin}
              onChangeCity={(newCity: CityModel | null) => {
                handleChangeCitySelect(
                  'origin',
                  newCity,
                  values,
                  setFieldValue,
                  setFieldError
                );
              }}
              onBlur={() => {
                handleBlurCitySelect(
                  'origin',
                  values,
                  setFieldTouched,
                  setFieldError
                );
              }}
              invalid={touched.origin && errors.origin}
            />
            {touched.origin && errors.origin && (
              <Form.Control.Feedback type='invalid' className='d-flex'>
                {errors.origin}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {values.intermediate.length > 0 && (
            <FieldArray name='intermediate'>
              {({ remove }) => (
                <React.Fragment>
                  {values.intermediate.map((item, idx) => (
                    <Form.Group
                      key={`inter-city-${idx}`}
                      className='mb-3 width-100-percent'
                    >
                      <Form.Label className='text-capitalize'>
                        City of {CityClassEnum.intermediate}
                      </Form.Label>
                      <div className='d-flex width-100-percent'>
                        <CitySelect
                          city={values.intermediate[idx]}
                          onChangeCity={(newCity: CityModel | null) => {
                            handleChangeCitySelect(
                              'intermediate',
                              newCity,
                              values,
                              setFieldValue,
                              setFieldError,
                              idx
                            );
                          }}
                          onBlur={() => {
                            handleBlurCitySelect(
                              'intermediate',
                              values,
                              setFieldTouched,
                              setFieldError,
                              idx
                            );
                          }}
                          invalid={getInterCityValid(
                            touched.intermediate,
                            errors.intermediate,
                            idx
                          )}
                        />
                        <Button
                          className='ms-2'
                          variant='danger'
                          type='button'
                          onClick={() => {
                            remove(idx);
                          }}
                        >
                          <TrashIcon
                            className='text-white'
                            style={{ height: '24px' }}
                          />
                        </Button>
                      </div>
                      {getInterCityValid(
                        touched.intermediate,
                        errors.intermediate,
                        idx
                      ) && (
                        <Form.Control.Feedback
                          className='d-flex'
                          type='invalid'
                        >
                          {errors.intermediate &&
                          typeof errors.intermediate === 'object'
                            ? errors.intermediate[idx]
                            : ''}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  ))}
                </React.Fragment>
              )}
            </FieldArray>
          )}
          <Form.Group className='mb-3'>
            <Form.Label className='text-capitalize'>
              {' '}
              City of {CityClassEnum.destination}
            </Form.Label>
            <CitySelect
              id='destination'
              name='destination'
              city={values.destination}
              onChangeCity={(newCity: CityModel | null) => {
                handleChangeCitySelect(
                  'destination',
                  newCity,
                  values,
                  setFieldValue,
                  setFieldError
                );
              }}
              onBlur={() => {
                handleBlurCitySelect(
                  'destination',
                  values,
                  setFieldTouched,
                  setFieldError
                );
              }}
              invalid={touched.destination && errors.destination}
            />
            {touched.destination && errors.destination && (
              <Form.Control.Feedback type='invalid' className='d-flex'>
                {errors.destination}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label className='text-capitalize'>
                  Date of the trip
                </Form.Label>
                <DatePicker
                  id='tripDate'
                  className='form-control'
                  name='tripDate'
                  onBlur={handleBlur}
                  selected={values.tripDate}
                  minDate={moment().add(1, 'days').toDate()}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  onChange={(date: Date) => {
                    setFieldValue('tripDate', date);
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label className='text-capitalize'>
                  Number of Passenger
                </Form.Label>
                <Form.Control
                  id='passenger'
                  name='passenger'
                  defaultValue={values.passenger}
                  type='text'
                  isInvalid={
                    touched.passenger && errors.passenger ? true : false
                  }
                  placeholder='Please input number of passenger'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  onKeyPress={(event: any) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
                {touched.passenger && errors.passenger && (
                  <Form.Control.Feedback type='invalid' className='d-flex'>
                    {errors.passenger}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <div className='d-flex justify-content-end'>
            <Button
              variant='outline-primary me-2'
              onClick={() => {
                setValues({
                  ...values,
                  intermediate: [...values.intermediate, null],
                });
              }}
            >
              Add Intermediate City
            </Button>
            <Button
              variant='primary'
              type='submit'
              disabled={submitBtnStates(errors)}
            >
              Search
            </Button>
          </div>
        </FormikForm>
      )}
    ></Formik>
  );
};

export default SearchTripForm;
