import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Get('/auth-health')
  async getHello() {
    const health = await this.authClient.send({ cmd: 'health-check' }, {});

    health.subscribe((data) => console.log(data));
  }
}
