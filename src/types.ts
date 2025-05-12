export interface Seller {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Sale {
  id: number;
  value: string | number;
  commission: string | number;
  sale_date: string;
}

export interface ApiResponse<T> {
  data: {
    data: T[];
    meta: {
      current_page: number;
      last_page: number;
    };
  };
}
