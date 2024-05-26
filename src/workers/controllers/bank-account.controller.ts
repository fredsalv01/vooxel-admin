import { CreateBankAccountDto } from './../dto/create-bank-account.dto';
import { AuthGuardJwt } from './../../auth/guards/auth-guard-jwt.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BankAccountService } from './../services/bank-account.service';
import { UpdateBankAccountDto } from '../dto/update-bank-account.dto';

@ApiTags('bank-accounts')
@ApiBearerAuth()
@Controller('bank-accounts')
export class BankAccountController {
  private readonly logger = new Logger(BankAccountController.name);

  constructor(private readonly bankAccountService: BankAccountService) {}

  @Get('/worker/:id')
  @UseGuards(AuthGuardJwt)
  findBankAccount(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`${this.findBankAccount.name} - Url Params: id`);
    this.logger.log(id);
    return this.bankAccountService.findByWorkerId(id);
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  create(@Body() createBankAccountDto: CreateBankAccountDto) {
    this.logger.log(
      `${this.create.name} - RequestBody`,
      JSON.stringify(createBankAccountDto, null, 2),
    );
    return this.bankAccountService.create(createBankAccountDto);
  }

  @Patch('/bank/:bankId')
  @UseGuards(AuthGuardJwt)
  update(
    @Param('bankId', ParseIntPipe) bankId: number,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ) {
    this.logger.log(`${this.update.name} = bankId: ${bankId} `);
    this.logger.debug('body', JSON.stringify(updateBankAccountDto, null, 2));
    return this.bankAccountService.update(bankId, updateBankAccountDto);
  }
}
