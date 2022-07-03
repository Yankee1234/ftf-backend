import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
  ) {}

  @Get('/auth-health')
  async getHello() {
  }
}
