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
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { filterClientsPaginatedDto } from './dto/filter-client-paginated.dto';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard-jwt.guard';

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
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
