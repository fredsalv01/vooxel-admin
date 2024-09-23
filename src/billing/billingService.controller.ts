import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BillingServiceService } from './billingService.service';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard-jwt.guard';
import { filterBillingServiceDto } from './dto/filter-get-billing-service.dto';
import { CreateBillingServiceDto } from './dto/create-billing-service.dto';

@ApiTags('billing-service')
@ApiBearerAuth()
@Controller('billing-service')
export class BillingServiceController {
  private readonly logger = new Logger(BillingServiceController.name);
  constructor(private readonly billingServiceService: BillingServiceService) {}

  @Post()
  @UseGuards(AuthGuardJwt)
  create(@Body() data: CreateBillingServiceDto) {
    this.logger.log(this.create.name);
    this.logger.debug('RequestBody', JSON.stringify(data, null, 2));
    return this.billingServiceService.create(data);
  }

  @Get()
  @UseGuards(AuthGuardJwt)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    this.logger.log(this.findAll.name);
    return this.billingServiceService.findAll();
  }
}
