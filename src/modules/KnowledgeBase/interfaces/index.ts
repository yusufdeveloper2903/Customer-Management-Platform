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
