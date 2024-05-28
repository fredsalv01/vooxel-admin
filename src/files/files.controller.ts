import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { FilesService } from './files.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BucketService } from '@app/bucket';
import * as moment from 'moment-timezone';
import { GetSignedUrlDto } from './dto/get-signed-url.dto';
import { GetDownloadUrlDto } from './dto/get-download-url.dto';
import { AuthGuardJwt } from '../auth/guards/auth-guard-jwt.guard';
import { CreateFileDto } from './dto/create-file.dto';
import { GetFilesDto } from './dto/get-files.dto';
import { FileTypes } from './enum/enum-type';

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
  @ApiBody({ type: CreateFileDto })
  @ApiResponse({
    status: 201,
    description: 'The file has been successfully created.',
  })
  create(@Body() body: CreateFileDto) {
    this.logger.log(this.create.name);
    this.logger.debug('body', JSON.stringify(body, null, 2));
    return this.filesService.create(body);
  }

  @Get()
  @UseGuards(AuthGuardJwt)
  @ApiQuery({ name: 'tableName', required: true, type: String })
  @ApiQuery({ name: 'tag', required: true, enum: FileTypes })
  @ApiQuery({ name: 'tableId', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return the file metadata based on query parameters.',
  })
  findOne(@Query() queryParams: GetFilesDto) {
    this.logger.log(this.findOne.name);
    this.logger.debug('query', JSON.stringify(queryParams, null, 2));
    return this.filesService.findOne(queryParams);
  }

  // retrive url to presign file
  @Get('presigned-url')
  @UseGuards(AuthGuardJwt)
  @ApiQuery({ name: 'type', required: true, enum: FileTypes })
  @ApiResponse({
    status: 200,
    description: 'Return a presigned URL for file upload.',
  })
  async presignedUrl(@Query() queryParams: GetSignedUrlDto) {
    this.logger.log(this.presignedUrl.name);
    this.logger.debug('queryParams', JSON.stringify(queryParams, null, 2));
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
  @ApiBody({ type: GetDownloadUrlDto })
  @ApiResponse({
    status: 200,
    description: 'Return a presigned URL for file download.',
  })
  getDownloadUrl(@Body() body: GetDownloadUrlDto) {
    this.logger.log(this.getDownloadUrl.name);
    this.logger.debug('body', JSON.stringify(body, null, 2));
    return this.bucketService.generateV4DownloadSignedUrl(body.filePath);
  }
}
