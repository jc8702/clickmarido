import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request, Response } from 'express';
import { generateCsrfToken } from './core/security/csrf';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('csrf-token')
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    const token = generateCsrfToken(req, res);
    return res.json({ token });
  }
}
