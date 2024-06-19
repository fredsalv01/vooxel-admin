import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { VacationsDetailsService } from '../services/vacationsDetails.service';
import { CreateVacationsDetailsDto } from '../dto/create-vacation-detail.dto';
import { VacationDetail } from '../entities/vacationDetail.entity';

@Controller('vacation-details')
export class VacationDetailsController {
  constructor(
    private readonly vacationDetailsService: VacationsDetailsService,
  ) {}

  // @Get()
  // async getAllVacationDetails(): Promise<CreateVacationsDetailsDto[]> {
  //   return this.vacationDetailsService.getAllVacationDetails();
  // }

  @Get(':id')
  async getVacationDetailsById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VacationDetail> {
    return this.vacationDetailsService.getVacationDetailById(id);
  }

  @Post()
  async createVacationDetails(
    @Body() vacationDetailsDto: CreateVacationsDetailsDto,
  ) {
    return this.vacationDetailsService.createVacationDetail(vacationDetailsDto);
  }

  // @Put(':id')
  // async updateVacationDetails(
  //   @Param('id') id: string,
  //   @Body() vacationDetailsDto: VacationDetailsDto,
  // ): Promise<VacationDetailsDto> {
  //   return this.vacationDetailsService.updateVacationDetails(
  //     id,
  //     vacationDetailsDto,
  //   );
  // }

  // @Delete(':id')
  // async deleteVacationDetails(@Param('id') id: string): Promise<void> {
  //   return this.vacationDetailsService.deleteVacationDetails(id);
  // }
}
