import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BucketService } from '@app/bucket';
import * as moment from 'moment-timezone';
import { GetSignedUrlDto } from './dto/get-signed-url.dto';
import { GetDownloadUrlDto } from './dto/get-download-url.dto';
import { AuthGuardJwt } from '../auth/guards/auth-guard-jwt.guard';
import { CreateFileDto } from './dto/create-file.dto';

@ApiTags('files')
@ApiBearerAuth()
@Controller('files')
@SerializeOptions({ strategy: 'exposeAll' })
export class FilesController {
  private readonly logger = new Logger(FilesController.name);
  constructor(
    private readonly filesService: FilesService,
    private readonly bucketService: BucketService,
  ) {}

  @Post()
  @UseGuards(AuthGuardJwt)
  create(@Body() body: CreateFileDto) {
    this.logger.log(this.create.name);
    this.logger.debug('body', JSON.stringify(body, null, 2));
    return this.filesService.create(body);
  }

  // retrive url to presign file
  @Get('presigned-url')
  @UseGuards(AuthGuardJwt)
  async presignedUrl(@Query() queryParams: GetSignedUrlDto) {
    this.logger.log(this.presignedUrl.name);
    this.logger.debug('query', JSON.stringify(queryParams, null, 2));
    const date = moment();
    const date_tz = date.tz('America/Lima').format('DD_MM_YYYY_HH_mm_ss');
    const fileName = `file_${date_tz}.pdf`;
    this.logger.debug('Generated FILENAME:', fileName);
    const response = await this.bucketService.generateV4UploadSignedUrl(
      fileName,
      queryParams.type,
    );
    return response;
  }
  // post filepath to get the file
  @Post('download-url')
  @UseGuards(AuthGuardJwt)
  getDownloadUrl(@Body() body: GetDownloadUrlDto) {
    this.logger.log(this.presignedUrl.name);
    this.logger.debug('body', JSON.stringify(body, null, 2));
    return this.bucketService.generateV4DownloadSignedUrl(body.filePath);
  }
}
