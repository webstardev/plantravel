export type CityModel = [string, number, number];
export enum CityClassEnum {
  origin = 'origin',
  intermediate = 'intermediate',
  destination = 'destination',
}

export type SearchCityAPIModel = {
  origin: string | null;
  intermediate: string[] | null;
  destination: string | null;
};

export type SearchCityResultModel = {
  origin: CityModel | null;
  intermediate: CityModel[];
  destination: CityModel | null;
};

export type CitySearchFormModel = {
  origin: CityModel | null;
  destination: CityModel | null;
  intermediate: Array<CityModel | null>;
  passenger: number;
  tripDate: Date | null;
};
