import { Injectable } from '@nestjs/common';
import { NotificationRepository } from 'src/domain/repositories/notification.repository';
import { CreateNotificationRequest } from './dtos/create-notification-request.dto';

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

        return await this.notificationRepo.getByUserId(userId);
    }

    async getCountUnreadNotifications(userId: number) {
        return await this.notificationRepo.getUnreadCount(userId);
    }
}
