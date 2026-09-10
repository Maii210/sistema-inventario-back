import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // Endpoint de salud: GET /api
  @Get()
  health() {
    return { name: 'Comercial Camila API', status: 'ok', time: new Date().toISOString() };
  }
}
