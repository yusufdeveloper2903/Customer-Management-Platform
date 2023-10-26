// for knowledge base

export interface ICategory {
  id: number;
  photo: string | null;
  name: string;
  step_id: number | null;
}

export interface IIntro {
  id: number;
  photo: string | null;
  name: string;
  description: string | null;
  step_id: number;
}

export interface ISplash {
  id: number;
  photo: string | null;
  version: string | number;
  time: string | null;
  is_active: boolean;
}
