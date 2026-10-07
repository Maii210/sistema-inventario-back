import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { IsString } from 'class-validator';
import { SettingsService } from './settings.service';

class SetSettingDto {
  @IsString()
  value!: string;
}

@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  findAll() {
    return this.settings.findAll();
  }

  @Get(':key')
  get(@Param('key') key: string) {
    return this.settings.get(key);
  }

  @Put(':key')
  set(@Param('key') key: string, @Body() dto: SetSettingDto) {
    return this.settings.upsert(key, dto.value);
  }
}
