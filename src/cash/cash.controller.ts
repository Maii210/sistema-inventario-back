import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CashService } from './cash.service';
import { OpenCashDto } from './dto/open-cash.dto';
import { CloseCashDto } from './dto/close-cash.dto';

@Controller('cash')
export class CashController {
  constructor(private readonly cash: CashService) {}

  @Get('current')
  current() {
    return this.cash.current();
  }

  @Get()
  history() {
    return this.cash.history();
  }

  @Post('open')
  open(@Body() dto: OpenCashDto) {
    return this.cash.open(dto);
  }

  @Post(':id/close')
  close(@Param('id') id: string, @Body() dto: CloseCashDto) {
    return this.cash.close(id, dto);
  }
}
