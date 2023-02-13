import { SearchCityResultModel } from '../models/City';
export const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
};

export const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export const getTotalDistance = (tripInfo: SearchCityResultModel) => {
  const { origin, intermediate, destination } = tripInfo;

  if (!origin) return 0;

  if (intermediate.length === 0 && destination) {
    return getDistanceFromLatLonInKm(
      origin[1],
      origin[2],
      destination[1],
      destination[2]
    );
  }
  // calc oring - inter , inter , inter - detim
  const origin2Inter = getDistanceFromLatLonInKm(
    origin[1],
    origin[2],
    intermediate[0][1],
    intermediate[0][2]
  );

  let interVal = 0;
  for (let i = 0; i < intermediate.length - 1; i++) {
    interVal += getDistanceFromLatLonInKm(
      intermediate[i][1],
      intermediate[i][2],
      intermediate[i + 1][1],
      intermediate[i + 1][2]
    );
  }

  let inter2Dest = 0;
  if (destination) {
    inter2Dest = getDistanceFromLatLonInKm(
      intermediate[intermediate.length - 1][1],
      intermediate[intermediate.length - 1][2],
      destination[1],
      destination[2]
    );
  }

  return origin2Inter + interVal + inter2Dest;
};
