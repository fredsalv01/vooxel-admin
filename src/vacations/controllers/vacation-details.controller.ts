import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { VacationsDetailsService } from '../services/vacationsDetails.service';
import { CreateVacationDetailDto } from '../dto/create-vacation-detail.dto';
import { VacationDetail } from '../entities/vacationDetail.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard-jwt.guard';
import { UpdateVacationDetailsDto } from '../dto/update-vacation-details.dto';
import { VacationsService } from '../services/vacations.service';

@ApiTags('vacation-details')
@ApiBearerAuth()
@Controller('vacation-details')
export class VacationDetailsController {
  constructor(
    private readonly vacationDetailsService: VacationsDetailsService,
    private readonly vacationService: VacationsService,
  ) {}

  @Get('/vacation/:vacationId')
  @UseGuards(AuthGuardJwt)
  async getAllVacationDetails(
    @Param('vacationId', ParseIntPipe) vacationId: number,
  ) {
    return this.vacationDetailsService.getAllVacationDetails(vacationId);
  }

  @Get(':id')
  @UseGuards(AuthGuardJwt)
  async getVacationDetailsById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VacationDetail> {
    return this.vacationDetailsService.getVacationDetailById(id);
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  async createVacationDetails(
    @Body() vacationDetailsDto: CreateVacationDetailDto,
  ) {
    return this.vacationDetailsService.createVacationDetail(vacationDetailsDto);
  }

  @Put('/vacation/:vacationId')
  @UseGuards(AuthGuardJwt)
  async updateVacationDetails(
    @Param('vacationId', ParseIntPipe) vacationId: number,
    @Body() vacationDetailsDto: UpdateVacationDetailsDto,
  ) {
    console.log('🚀 ~ VacationDetailsController ~ vacationId:', vacationId);
    console.log(
      '🚀 ~ VacationDetailsController ~ vacationDetailsDto:',
      vacationDetailsDto,
    );

    const workerId = await this.vacationDetailsService.updateVacationDetails(
      vacationDetailsDto,
      vacationId,
    );

    return await this.vacationService.findAll(workerId);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  async deleteVacationDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return this.vacationDetailsService.deleteVacationDetails(id);
  }
}
