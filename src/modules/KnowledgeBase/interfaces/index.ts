export interface Results<T> {
  count: number;
  next: number | null;
  previous: number | null;
  results: T[];
}

export interface SmsTemplate {
  id: number;
  title: {
    uz: string | null;
    ru: string | null;
  };
  description: {
    uz: string | null;
    ru: string | null;
  };
}

export interface NewsTemplate {
  id?: number;
  title: {
    uz: string | null;
    ru: string | null;
  };
  description: {
    uz: string | null;
    ru: string | null;
  };
  file: null | string;
  url: string;
}

export interface Params {
  page?: number;
  page_size?: number;
  search?: string;
}

export interface Lang {
  ru: string;
  uz: string;
}

export interface LocationPlace {
  id?: number;
  title: Lang;
  address: Lang;
  coordinates: {
    lat: number;
    long: number;
  };
  phones: string[];
  region: {
    id: 1;
    name: {
      ru: string;
      uz: string;
    };
    parent: null;
  };
  content_type_id: number;
}

export interface LocationPlaceData {
  id?: 1;
  title: Lang;
  address: Lang;
  coordinates: {
    lat: number | null;
    lng: number | null;
  };
  phones: string[];
  region: number | null;
}

export interface Regions {
  id: number;
  name: {
    ru: string;
    uz: string;
  };
  parent: null | number;
}

export interface VersionControl {
  number: string,
  is_active: boolean,
  created_date: string,
  modified_date: string
}


export interface Products {
  id: number,
  title: {
    ru: string | null,
    uz: string | null
  },
  price:null | number,
  image: string | null,
  code: string
}