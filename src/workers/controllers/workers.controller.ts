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
} from '@nestjs/common';
import { WorkersService } from '../services/workers.service';
import { CreateWorkerDto } from '../dto/create-worker.dto';
import { UpdateWorkerDto } from '../dto/update-worker.dto';
import { PaginationDto } from '../../pagination/dto/pagination.dto';

@Controller('workers')
@SerializeOptions({ strategy: 'exposeAll' })
export class WorkersController {
  private readonly logger = new Logger(WorkersController.name);
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  create(@Body() createWorkerDto: CreateWorkerDto) {
    return this.workersService.create(createWorkerDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(
    @Query() queryParams: PaginationDto
  ) {
    return this.workersService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkerDto: UpdateWorkerDto) {
    return this.workersService.update(+id, updateWorkerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workersService.remove(+id);
  }
}
