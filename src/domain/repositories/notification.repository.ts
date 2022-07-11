import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "../entities/notification.entity";

@Injectable()
export class NotificationRepository {
    constructor(@InjectRepository(Notification) private readonly repo: Repository<Notification>) {}

    create() {
        return this.repo.create();
    }

    async save(entity: Notification) {
        await this.repo.save(entity);
    }

    async getByUserId(userId: number) {
        return await this.repo.createQueryBuilder('n')
        .where('n.userId = :userId', {userId})
        .getMany();
    }

    async readAllByUserId(userId: number) {
        return await this.repo.createQueryBuilder('n')
        .update({ readAt: new Date() })
        .where('n.userId = :userId', {userId})
        .andWhere('n.readAt IS NULL')
        .execute();
    }

    async getUnreadCount(userId: number) {
        return await this.repo.createQueryBuilder('n')
        .where('n.userId = :userId', {userId})
        .andWhere('n.readAt IS NULL')
        .getCount();
    }
}