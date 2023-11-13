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

//   news
export interface News {
    id: number;
    start_time: string;
    title: {
        ru: string;
        uz: string;
    },
    description: {
        ru: string;
        uz: string;
    };
    file: string | null;
    url_title: null | string,
    url: string | null,
    enable_push_notify: boolean;
    template: {
        id: number;
        title: {
            ru: string;
            uz: string;
        }
        description: {
            ru: string;
            uz: string;
        };
        file: string | null;
        url: string | null;
    }
    status: null | string
}

// sms sending
export interface SmsSending {
    id: number;
    start_time: string | null
    title: {
        ru: string;
        uz: string;
    },
    description: {
        ru: string;
        uz: string;
    };
    template: {
        id: number;
        title: {
            ru: string;
            uz: string;
        }
        description: {
            ru: string;
            uz: string;
        };
        file: string | null;
        url: string | null;
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