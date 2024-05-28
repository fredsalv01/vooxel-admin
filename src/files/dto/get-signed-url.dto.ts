import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FileTypes } from '../enum/enum-type';
import { ApiProperty } from '@nestjs/swagger';

export class GetSignedUrlDto {
  @ApiProperty({
    description: 'Tipo de files válidos',
    example: `${FileTypes.CV}`,
  })
  @IsString()
  @IsEnum(FileTypes, {
    message: `Solo son válidos los tipos: ${Object.values(FileTypes)}`,
  })
  @IsNotEmpty()
  type: FileTypes;
}
