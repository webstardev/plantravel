import moment from 'moment';
import * as Yup from 'yup';
export const searchCityValidateSchema = Yup.object().shape({
  origin: Yup.array().required('Origin city required'),
  destination: Yup.array().required('Destination city required'),
  intermediate: Yup.array().of(
    Yup.array().required('Please select intermediate city')
  ),
  passenger: Yup.number().min(1, 'Passenger should be at least 1').required(),
  tripDate: Yup.date()
    .min(moment().add(1, 'days'), 'Should be a date in the future')
    .required(),
});

export const validateNearbyDuplicate = (
  fieldValue: any,
  values: any
): boolean => {
  if (!fieldValue.value) return true;
  if (fieldValue.field === 'origin') {
    if (
      values.intermediate?.length > 0 &&
      values.intermediate[0] &&
      fieldValue.value[0] === values.intermediate[0][0]
    )
      return false;
    if (values.destination && fieldValue.value[0] === values.destination[0])
      return false;
  }

  if (fieldValue.field === 'destination') {
    if (
      values.intermediate?.length > 0 &&
      values.intermediate[values.intermediate.length - 1] &&
      fieldValue.value[0] ===
        values.intermediate[values.intermediate.length - 1][0]
    )
      return false;
    if (values.origin && fieldValue.value[0] === values.origin[0]) return false;
  }

  if (fieldValue.field === 'intermediate') {
    if (fieldValue.idx === 0) {
      if (values.origin && fieldValue.value[0] === values.origin[0])
        return false;
    }
    if (fieldValue.idx === values.intermediate.length - 1) {
      if (!values.destination) return true;
      if (
        values.destination &&
        fieldValue.value[0] ===
          values.destination[values.intermediate.length - 1]
      )
        return false;
    }

    if (fieldValue.idx - 1 < 0) return true;
    if (
      (values.intermediate[fieldValue.idx - 1] &&
        fieldValue.value[0] === values.intermediate[fieldValue.idx - 1][0]) ||
      fieldValue.value[0] === values.intermediate[fieldValue.idx - 1][0]
    )
      return false;
  }

  return true;
};
