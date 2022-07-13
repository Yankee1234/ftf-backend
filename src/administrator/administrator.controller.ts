import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { PrivateRequest } from 'src/auth/requests';
import { AuthRole } from 'src/auth/security';
import { AdministratorService } from './administrator.service';

@Controller('administrator')
@ApiTags('Administrator')
export class AdministratorController {
  constructor(private readonly adminService: AdministratorService) {}

  @Get('me')
  @Auth()
  @ApiOperation({ summary: 'Get admin profile' })
  async getAdministratorProfile(@Req() req: PrivateRequest) {
    if (req.user.role !== AuthRole.Admin)
      throw new UnauthorizedException('You are not an admin');

    return await this.adminService.getProfile(req.user.id);
  }
}
