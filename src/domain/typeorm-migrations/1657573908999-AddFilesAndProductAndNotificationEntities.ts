import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFilesAndProductAndNotificationEntities1657573908999 implements MigrationInterface {
    name = 'AddFilesAndProductAndNotificationEntities1657573908999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_files" ("id" SERIAL NOT NULL, "fileName" character varying NOT NULL, "data" bytea NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_b01e2cd05bbd1ec1fddbd396ce3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), "stripeProductId" character varying NOT NULL, "stripePriceId" character varying NOT NULL, "moneyAmount" numeric(13,2) NOT NULL, "moneyCurrency" character(3) NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products_files" ("id" SERIAL NOT NULL, "fileName" character varying NOT NULL, "data" bytea NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_08ced89734a099b1cd8d648d383" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "lastNumbers" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_files" ADD CONSTRAINT "FK_74cae0ea1fbb3df84c488ec0383" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_files" ADD CONSTRAINT "FK_d6143daa56b0a61c160ea9b15c5" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products_files" DROP CONSTRAINT "FK_d6143daa56b0a61c160ea9b15c5"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);
        await queryRunner.query(`ALTER TABLE "users_files" DROP CONSTRAINT "FK_74cae0ea1fbb3df84c488ec0383"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "lastNumbers"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "userId"`);
        await queryRunner.query(`DROP TABLE "products_files"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "users_files"`);
    }

}
