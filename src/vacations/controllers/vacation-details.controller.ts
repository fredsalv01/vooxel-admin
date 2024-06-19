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

@ApiTags('vacation-details')
@ApiBearerAuth()
@Controller('vacation-details')
export class VacationDetailsController {
  constructor(
    private readonly vacationDetailsService: VacationsDetailsService,
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

  @Put(':id')
  @UseGuards(AuthGuardJwt)
  async updateVacationDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body() vacationDetailsDto: UpdateVacationDetailsDto,
  ) {
    return this.vacationDetailsService.updateVacationDetails(
      id,
      vacationDetailsDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  async deleteVacationDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.vacationDetailsService.deleteVacationDetails(id);
  }
}
