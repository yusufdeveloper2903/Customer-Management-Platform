// for knowledge base

// export interface ICategory {
//   id: number;
//   photo: string | null;
//   name: string;
//   step_id: number | null;
// }

// export interface IIntro {
//   id: number;
//   photo: string | null;
//   name: string;
//   description: string | null;
//   step_id: number;
// }

// export interface ISplash {
//   id: number;
//   photo: string | null;
//   version: string | number;
//   time: string | null;
//   is_active: boolean;
// }

// sms template
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
