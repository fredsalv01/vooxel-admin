import { IsNotEmpty, IsString } from 'class-validator';

export class GetDownloadUrlDto {
  @IsString()
  @IsNotEmpty()
  filePath: string;
}
