import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../pagination/dto/pagination.dto';
// import { Transform } from 'class-transformer';

export interface Filter {
  // filters?: any[
  //   /**
  //    * year: [2021, 2022, 2023, 2024, 2025]
  //    * month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  //    * dates: [
  //    *  {
  //    *    column:"date",
  //    *    start_date: "2021-01-01",
  //    *    end_date: "null"
  //    *  }
  //    * ],
  //    * order: [column = id, direction = 'desc']
  //    */
  //   ];
  year: number[];
  month: number[];
  currency: string[];
  state: string;
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

export class filterBillingPaginatedDto extends PaginationDto {
  @IsString()
  @IsOptional()
  input?: string;

  @IsOptional()
  filters?: Filter[];
}
