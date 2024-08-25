import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ValidationPipe,
  UsePipes,
  UseInterceptors,
  ClassSerializerInterceptor,
  Logger,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientsService } from './../services/clients.service';
import { CreateClientDto } from './../dto/create-client.dto';
import { UpdateClientDto } from './../dto/update-client.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { filterClientsPaginatedDto } from './../dto/filter-client-paginated.dto';
import { AuthGuardJwt } from '../../auth/guards/auth-guard-jwt.guard';

@ApiTags('clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  private readonly logger = new Logger(ClientsController.name);
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UseGuards(AuthGuardJwt)
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @UseGuards(AuthGuardJwt)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Query() queryParams: filterClientsPaginatedDto) {
    this.logger.log(this.findAll.name);
    this.logger.debug('query', JSON.stringify(queryParams, null, 2));
    return this.clientsService.findAll(queryParams);
  }

  @Get(':id')
  @UseGuards(AuthGuardJwt)
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(this.findOne.name);
    this.logger.debug('query', JSON.stringify(id, null, 2));
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.remove(id);
  }
}
