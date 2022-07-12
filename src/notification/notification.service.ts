import { Injectable } from '@nestjs/common';
import { Notification } from 'src/domain/entities/notification.entity';
import { NotificationRepository } from 'src/domain/repositories/notification.repository';
import { CreateNotificationRequest } from './dtos/create-notification-request.dto';
import { Notification as NotificationDto } from './dtos/notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async createNotification(req: CreateNotificationRequest) {
    const notification = await this.notificationRepo.create();

    notification.message = req.message;
    notification.userId = req.userId;

    await this.notificationRepo.save(notification);
  }

  async getUserNotifications(userId: number) {
    await this.notificationRepo.readAllByUserId(userId);

    return (await this.notificationRepo.getByUserId(userId)).map((n) =>
      NotificationService.toNotificationDto(n),
    );
  }

  async getCountUnreadNotifications(userId: number) {
    return await this.notificationRepo.getUnreadCount(userId);
  }

  static toNotificationDto(notification: Notification): NotificationDto {
    return new NotificationDto(notification.message, notification.createdAt);
  }
}
