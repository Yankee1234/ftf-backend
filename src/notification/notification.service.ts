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
    return (await this.notificationRepo.getUsersNotifications(userId)).map((n) =>
      NotificationService.toNotificationDto(n),
    );
  }

  async getCountUnreadNotifications(userId: number) {
    return await this.notificationRepo.getUnreadCount(userId);
  }

  static toNotificationDto(notification: Notification): NotificationDto {
    return new NotificationDto(notification.message, notification.createdAt);
  }

  async readAllNotifications(userId: number) {
    const notifications = await this.notificationRepo.getUsersNotifications(userId);

    for(let i = 0; i < notifications.length; i += 1) {
      const n = notifications[i];
      n.readAt = new Date();

      await this.notificationRepo.save(n);
    }

    return await this.getUserNotifications(userId);
  }
}
