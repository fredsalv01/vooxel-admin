import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBillingServiceDto {
  @ApiProperty({
    description: 'Nombre del servicio',
    example: 'Consultoria',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
