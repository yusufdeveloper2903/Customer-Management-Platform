export interface Results<T> {
    count: number;
    next: number | null;
    previous: number | null;
    results: T[];
  }

  export interface Banner {
    id: number;
    start_time: string | null;
    end_time: string | null;
    title: {
        ru: string | null;
        uz: string | null
    };
    description: {
        ru: string | null;
        uz: string | null
    };
    file: string | null;
    url: string | null;
    template: {
        id: number;
        title: {
            ru: string | null;
            uz: string | null
        }
    }
    status: {
        id: number;
        title: {
            ru: string | null;
            uz: string | null
        }
        unique_name: string
    }
  }

//   status
export interface Status {
    id: number;
        title: {
            ru: string | null;
            uz: string | null
        }
    unique_name: string
}