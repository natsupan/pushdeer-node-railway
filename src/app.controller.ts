import { Controller, All } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All()
  getHello() {
    return this.appService.getHello();
  }
}
