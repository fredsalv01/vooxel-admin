export interface Filters {
  year: number[];
  month: string[];
  currency: string[];
  state: string;
  service: string[];
  client: string[];
  dates: {
    column: string;
    start_date: string;
    end_date: string;
  }[];
  order: {
    column: string;
    direction: string;
  };
}

export interface DateRange {
  column: string;
  start_date: string;
  end_date: string;
}

export interface OrderData {
  column: string;
  direction: string;
}
