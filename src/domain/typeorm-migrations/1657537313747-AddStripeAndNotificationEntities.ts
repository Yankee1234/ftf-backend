import {MigrationInterface, QueryRunner} from "typeorm";

export class AddStripeAndNotificationEntities1657537313747 implements MigrationInterface {
    name = 'AddStripeAndNotificationEntities1657537313747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "message" text NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), "readAt" TIMESTAMP, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stripe_customers" ("stripeCustomerId" character varying NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), CONSTRAINT "REL_1471f71a3e248e6e76e0993b45" UNIQUE ("userId"), CONSTRAINT "PK_778a14299eaf933769fd8ea39ca" PRIMARY KEY ("stripeCustomerId"))`);
        await queryRunner.query(`CREATE TYPE "public"."payment_methods_pmtype_enum" AS ENUM('card')`);
        await queryRunner.query(`CREATE TABLE "payment_methods" ("paymentMethodId" character varying NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), "userId" integer NOT NULL, "pmType" "public"."payment_methods_pmtype_enum" NOT NULL DEFAULT 'card', CONSTRAINT "PK_d7f5fbb8810fd2ce0f8394b3b52" PRIMARY KEY ("paymentMethodId"))`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'succeeded')`);
        await queryRunner.query(`CREATE TABLE "payments" ("stripePaymentId" character varying NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), "status" "public"."payments_status_enum" NOT NULL, "chargeAmount" numeric(13,2) NOT NULL, "chargeCurrency" character(3) NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_28cd4ce1f32d256c2b62df53f86" PRIMARY KEY ("stripePaymentId"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "games" ADD "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users_profiles" DROP CONSTRAINT "FK_1cfade2944c4f57894eb1e4af34"`);
        await queryRunner.query(`ALTER TABLE "users_games" DROP CONSTRAINT "FK_dc7c369d193aa998e9f399d5575"`);
        await queryRunner.query(`ALTER TABLE "users_profiles" ADD CONSTRAINT "UQ_1cfade2944c4f57894eb1e4af34" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "admin_profiles" DROP CONSTRAINT "FK_d1b5f61ecc9c83a766503b9eb77"`);
        await queryRunner.query(`ALTER TABLE "admin_profiles" ADD CONSTRAINT "UQ_d1b5f61ecc9c83a766503b9eb77" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "users_profiles" ADD CONSTRAINT "FK_1cfade2944c4f57894eb1e4af34" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_games" ADD CONSTRAINT "FK_dc7c369d193aa998e9f399d5575" FOREIGN KEY ("userId") REFERENCES "users_profiles"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admin_profiles" ADD CONSTRAINT "FK_d1b5f61ecc9c83a766503b9eb77" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stripe_customers" ADD CONSTRAINT "FK_1471f71a3e248e6e76e0993b45a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD CONSTRAINT "FK_580f1dbf7bceb9c2cde8baf7ff4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP CONSTRAINT "FK_580f1dbf7bceb9c2cde8baf7ff4"`);
        await queryRunner.query(`ALTER TABLE "stripe_customers" DROP CONSTRAINT "FK_1471f71a3e248e6e76e0993b45a"`);
        await queryRunner.query(`ALTER TABLE "admin_profiles" DROP CONSTRAINT "FK_d1b5f61ecc9c83a766503b9eb77"`);
        await queryRunner.query(`ALTER TABLE "users_games" DROP CONSTRAINT "FK_dc7c369d193aa998e9f399d5575"`);
        await queryRunner.query(`ALTER TABLE "users_profiles" DROP CONSTRAINT "FK_1cfade2944c4f57894eb1e4af34"`);
        await queryRunner.query(`ALTER TABLE "admin_profiles" DROP CONSTRAINT "UQ_d1b5f61ecc9c83a766503b9eb77"`);
        await queryRunner.query(`ALTER TABLE "admin_profiles" ADD CONSTRAINT "FK_d1b5f61ecc9c83a766503b9eb77" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_profiles" DROP CONSTRAINT "UQ_1cfade2944c4f57894eb1e4af34"`);
        await queryRunner.query(`ALTER TABLE "users_games" ADD CONSTRAINT "FK_dc7c369d193aa998e9f399d5575" FOREIGN KEY ("userId") REFERENCES "users_profiles"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_profiles" ADD CONSTRAINT "FK_1cfade2944c4f57894eb1e4af34" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TABLE "payment_methods"`);
        await queryRunner.query(`DROP TYPE "public"."payment_methods_pmtype_enum"`);
        await queryRunner.query(`DROP TABLE "stripe_customers"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
