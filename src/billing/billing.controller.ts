import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SerializeOptions,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Logger,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from './../auth/guards/auth-guard-jwt.guard';
import { filterBillingPaginatedDto } from './dto/filter-get-billing.dto';

@ApiTags('billing')
@ApiBearerAuth()
@Controller('billing')
@SerializeOptions({ strategy: 'exposeAll' })
export class BillingController {
  private readonly logger = new Logger(BillingController.name);
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @UseGuards(AuthGuardJwt)
  create(@Body() createBillingDto: CreateBillingDto) {
    this.logger.log(this.create.name);
    this.logger.debug('RequestBody', JSON.stringify(createBillingDto, null, 2));
    return this.billingService.create(createBillingDto);
  }

  @Post('/find')
  @UseGuards(AuthGuardJwt)
  findAll(@Body() request: filterBillingPaginatedDto) {
    this.logger.log(this.findAll.name);
    this.logger.debug('query', JSON.stringify(request, null, 2));
    return this.billingService.findAll(request);
  }

  @Get('unique_values')
  @UseGuards(AuthGuardJwt)
  getUniqueValues() {
    return this.billingService.getUniqueValues();
  }

  @Get(':id')
  @UseGuards(AuthGuardJwt)
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(this.findOne.name);
    this.logger.debug('urlParams', id);
    return this.billingService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBillingDto: UpdateBillingDto,
  ) {
    this.logger.log(this.update.name);
    this.logger.debug('urlParams - id:', id);
    this.logger.debug('body', JSON.stringify(updateBillingDto, null, 2));
    return this.billingService.update(id, updateBillingDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  remove(@Param('id') id: string) {
    return this.billingService.remove(+id);
  }
}
