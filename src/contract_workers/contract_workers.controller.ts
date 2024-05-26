import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ContractWorkersService } from './contract_workers.service';
import { CreateContractWorkerDto } from './dto/create-contract_worker.dto';
import { UpdateContractWorkerDto } from './dto/update-contract_worker.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard-jwt.guard';

@ApiTags('contract_workers')
@ApiBearerAuth()
@Controller('contract-workers')
export class ContractWorkersController {
  private readonly logger = new Logger(ContractWorkersController.name);
  constructor(
    private readonly contractWorkersService: ContractWorkersService,
  ) {}

  @Post()
  @UseGuards(AuthGuardJwt)
  create(@Body() createContractWorkerDto: CreateContractWorkerDto) {
    this.logger.log(this.create.name);
    this.logger.debug(
      'RequestBody',
      JSON.stringify(createContractWorkerDto, null, 2),
    );
    return this.contractWorkersService.create(createContractWorkerDto);
  }

  @Get(':workerId')
  @UseGuards(AuthGuardJwt)
  findAll(@Param('workerId', ParseIntPipe) workerId: number) {
    return this.contractWorkersService.findAll(workerId);
  }

  @Get('/worker/:workerId')
  @UseGuards(AuthGuardJwt)
  findOne(@Param('workerId', ParseIntPipe) workerId: number) {
    return this.contractWorkersService.findOne(workerId);
  }

  @Patch('/contract/:id')
  @UseGuards(AuthGuardJwt)
  updateContractState(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContractWorkerDto: UpdateContractWorkerDto,
  ) {
    return this.contractWorkersService.update(id, updateContractWorkerDto);
  }
}
