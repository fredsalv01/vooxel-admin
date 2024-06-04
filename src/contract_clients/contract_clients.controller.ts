import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContractClientsService } from './contract_clients.service';
import { CreateContractClientDto } from './dto/create-contract_client.dto';
import { UpdateContractClientDto } from './dto/update-contract_client.dto';

@Controller('contract-clients')
export class ContractClientsController {
  constructor(
    private readonly contractClientsService: ContractClientsService,
  ) {}

  @Post()
  create(@Body() createContractClientDto: CreateContractClientDto) {
    return this.contractClientsService.create(createContractClientDto);
  }

  @Get()
  findAll() {
    return this.contractClientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractClientsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractClientDto: UpdateContractClientDto,
  ) {
    return this.contractClientsService.update(+id, updateContractClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractClientsService.remove(+id);
  }
}
