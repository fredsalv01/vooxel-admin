import { CreateBankAccountDto } from './../dto/create-bank-account.dto';
import { AuthGuardJwt } from './../../auth/guards/auth-guard-jwt.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { BankAccountService } from './../services/bank-account.service';

@ApiTags('bank-accounts')
@ApiBearerAuth()
@Controller('bank-accounts')
export class BankAccountController {
  private readonly logger = new Logger(BankAccountController.name);

  constructor(
    private readonly bankAccountService: BankAccountService
  ){}

  @Get('/worker/:id')
  @UseGuards(AuthGuardJwt)
  findBankAccount(
    @Param('id', ParseIntPipe) id: number
  ){
    this.logger.log(`${this.findBankAccount.name} - Url Params: id`);
    this.logger.log(id);
    return this.bankAccountService.findByWorkerId(id);
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  create(
    @Body() createBankAccountDto: CreateBankAccountDto
  ){
    this.logger.log(`${this.create.name} - RequestBody`, JSON.stringify(createBankAccountDto, null, 2));
    return this.bankAccountService.create(createBankAccountDto)
  }

  @Get('/bank/:bankId')
  @UseGuards(AuthGuardJwt)
  updateState(@Param('bankId', ParseIntPipe) bankId: number){
    this.logger.log(`${this.updateState.name} = bankId: ${bankId} `);
    return this.bankAccountService.updateState(bankId);
  }
}