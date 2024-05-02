import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SerializeOptions,
  Logger,
  UsePipes,
  ValidationPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WorkersService } from '../services/workers.service';
import { CreateWorkerDto } from '../dto/create-worker.dto';
import { UpdateWorkerDto } from '../dto/update-worker.dto';
import { filterWorkersPaginatedDto } from '../dto/filter-get-workers.dto';
import { AuthGuardJwt } from '../../auth/guards/auth-guard-jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('workers')
@ApiBearerAuth()
@Controller('workers')
@SerializeOptions({ strategy: 'exposeAll' })
export class WorkersController {
  private readonly logger = new Logger(WorkersController.name);
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  @UseGuards(AuthGuardJwt)
  create(@Body() createWorkerDto: CreateWorkerDto) {
    this.logger.log(this.create.name);
    this.logger.debug('body', JSON.stringify(createWorkerDto, null, 2));
    return this.workersService.create(createWorkerDto);
  }

  @Get()
  @UseGuards(AuthGuardJwt)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Query() queryParams: filterWorkersPaginatedDto) {
    this.logger.log(this.findAll.name);
    this.logger.debug('query', queryParams);
    return this.workersService.findAll(queryParams);
  }

  @Get(':id')
  @UseGuards(AuthGuardJwt)
  findOne(@Param('id') id: string) {
    this.logger.log(this.findOne.name);
    this.logger.debug('urlParams', id);
    return this.workersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  update(@Param('id') id: string, @Body() updateWorkerDto: UpdateWorkerDto) {
    this.logger.log(this.update.name);
    this.logger.debug('urlParams - id:', id);
    this.logger.debug('body', JSON.stringify(updateWorkerDto, null, 2));
    return this.workersService.update(+id, updateWorkerDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  remove(@Param('id') id: string) {
    this.logger.log(this.remove.name);
    this.logger.debug('urlParams', id);
    return this.workersService.remove(+id);
  }
}
