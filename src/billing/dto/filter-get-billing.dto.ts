import { IsOptional, IsString } from 'class-validator';
import { FiltersBillingDto } from './filter-billing-definition.dto';
import { ApiProperty } from '@nestjs/swagger';

export class filterBillingPaginatedDto extends FiltersBillingDto {
  @ApiProperty({
    description: 'Input del filtro',
    example: 'PENDIENTE',
  })
  @IsString()
  @IsOptional()
  input?: string;
}
