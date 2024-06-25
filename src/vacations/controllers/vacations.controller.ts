import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { VacationsService } from '../services/vacations.service';
import { CreateVacationDto } from '../dto/create-vacation.dto';
import { UpdateVacationDto } from '../dto/update-vacation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard-jwt.guard';

@ApiTags('vacations')
@ApiBearerAuth()
@Controller('vacations')
export class VacationsController {
  private readonly logger = new Logger(VacationsController.name);
  constructor(private readonly vacationsService: VacationsService) {}

  @Post()
  @UseGuards(AuthGuardJwt)
  create(@Body() createVacationDto: CreateVacationDto) {
    this.logger.log(
      `${this.create.name} - createVacationDto: ${JSON.stringify(
        createVacationDto,
        null,
        2,
      )}`,
    );
    return this.vacationsService.create(createVacationDto);
  }

  @Get('/workerId/:workerId')
  findAll(@Param('workerId', ParseIntPipe) workerId: number) {
    this.logger.log(
      `${this.findAll.name} - contractWorkerId: ${workerId}`,
    );
    return this.vacationsService.findAll(workerId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`${this.findOne.name} - id: ${id}`);
    return this.vacationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVacationDto: UpdateVacationDto,
  ) {
    this.logger.log(
      `${this.update.name} - id: ${id} - updateVacationDto: ${JSON.stringify(
        updateVacationDto,
        null,
        2,
      )}`,
    );
    return this.vacationsService.update(id, updateVacationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`${this.remove.name} - id: ${id}`);
    return this.vacationsService.remove(id);
  }
}
