import {MigrationInterface, QueryRunner} from "typeorm";

export class InitDbFirstTables1655821027830 implements MigrationInterface {
    name = 'InitDbFirstTables1655821027830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `file_storage` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `mimeType` varchar(255) NOT NULL, `data` longblob NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `login` varchar(255) NOT NULL, `password` varchar(255) NULL, `email` varchar(255) NOT NULL, `role` enum ('user', 'admin') NOT NULL DEFAULT 'user', PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `admin_profiles` (`userId` int NOT NULL, `role` enum ('admin', 'super-admin', 'helper') NOT NULL, `avatarId` int NULL, UNIQUE INDEX `REL_d1b5f61ecc9c83a766503b9eb7` (`userId`), PRIMARY KEY (`userId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `tokens` (`id` int NOT NULL AUTO_INCREMENT, `token` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `isActive` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users_profiles` (`userId` int NOT NULL, `userName` varchar(255) NULL, `phoneNumber` varchar(255) NULL, `role` enum ('newbie', 'subscriber', 'old-guard') NOT NULL DEFAULT 'newbie', `avatarId` int NULL, UNIQUE INDEX `REL_1cfade2944c4f57894eb1e4af3` (`userId`), PRIMARY KEY (`userId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `admin_profiles` ADD CONSTRAINT `FK_d1b5f61ecc9c83a766503b9eb77` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users_profiles` ADD CONSTRAINT `FK_1cfade2944c4f57894eb1e4af34` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users_profiles` DROP FOREIGN KEY `FK_1cfade2944c4f57894eb1e4af34`");
        await queryRunner.query("ALTER TABLE `admin_profiles` DROP FOREIGN KEY `FK_d1b5f61ecc9c83a766503b9eb77`");
        await queryRunner.query("DROP INDEX `REL_1cfade2944c4f57894eb1e4af3` ON `users_profiles`");
        await queryRunner.query("DROP TABLE `users_profiles`");
        await queryRunner.query("DROP TABLE `tokens`");
        await queryRunner.query("DROP INDEX `REL_d1b5f61ecc9c83a766503b9eb7` ON `admin_profiles`");
        await queryRunner.query("DROP TABLE `admin_profiles`");
        await queryRunner.query("DROP TABLE `users`");
        await queryRunner.query("DROP TABLE `file_storage`");
    }

}
