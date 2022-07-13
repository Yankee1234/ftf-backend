import { Controller, Get, Put, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/auth.decorator';
import { PrivateRequest } from 'src/auth/requests';
import { NotificationService } from './notification.service';

@Controller('notification')
@ApiTags('Notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get all users notification' })
  async getUserNotifications(@Req() req: PrivateRequest) {
    return await this.notificationService.getUserNotifications(req.user.id);
  }

  @Get('count')
  @Auth()
  @ApiOperation({ summary: 'Get count of unread notifications' })
  async getUnreadNotificationsCount(@Req() req: PrivateRequest) {
    return await this.notificationService.getCountUnreadNotifications(
      req.user.id,
    );
  }

  @Put('read-all')
  @Auth()
  @ApiOperation({ summary: 'Mark all notifications as read'})
  async readAllNotifications(@Req() req: PrivateRequest) {
    return await this.notificationService.readAllNotifications(req.user.id);
  }
}
