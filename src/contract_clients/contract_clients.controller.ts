import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { ContractClientsService } from './contract_clients.service';
import { CreateContractClientDto } from './dto/create-contract_client.dto';
import { UpdateContractClientDto } from './dto/update-contract_client.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from '../auth/guards/auth-guard-jwt.guard';

@ApiTags('contract_clients')
@ApiBearerAuth()
@Controller('contract-clients')
export class ContractClientsController {
  private readonly logger = new Logger(ContractClientsController.name);

  constructor(
    private readonly contractClientsService: ContractClientsService,
  ) {}

  @Post()
  @UseGuards(AuthGuardJwt)
  create(@Body() createContractClientDto: CreateContractClientDto) {
    this.logger.log(
      `${this.create.name} - createContractClientDto: ${JSON.stringify(
        createContractClientDto,
        null,
        2,
      )}`,
    );

    return this.contractClientsService.create(createContractClientDto);
  }

  @Get(':clientId')
  findAll(@Param('clientId', ParseIntPipe) clientId: number) {
    this.logger.log(
      `${this.findAll.name} - clientId: ${JSON.stringify(clientId, null, 2)}`,
    );
    return this.contractClientsService.findAll(clientId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log('findOne - id:', id);
    return this.contractClientsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContractClientDto: UpdateContractClientDto,
  ) {
    this.logger.log(
      `${this.update.name} - id: ${JSON.stringify(id, null, 2)}`,
      `${this.update.name} - updateContractClientDto: ${JSON.stringify(
        updateContractClientDto,
        null,
        2,
      )}`,
    );
    return this.contractClientsService.update(id, updateContractClientDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`${this.remove.name} - id: ${JSON.stringify(id, null, 2)}`);
    return this.contractClientsService.remove(id);
  }
}
