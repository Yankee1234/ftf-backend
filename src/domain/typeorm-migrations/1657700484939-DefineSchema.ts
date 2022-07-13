import {MigrationInterface, QueryRunner} from "typeorm";

export class DefineSchema1657700484939 implements MigrationInterface {
    name = 'DefineSchema1657700484939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "login" character varying NOT NULL, "password" character varying, "email" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_files" ("id" SERIAL NOT NULL, "fileName" character varying NOT NULL, "data" bytea NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_b01e2cd05bbd1ec1fddbd396ce3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin_profiles" ("userId" integer NOT NULL, "role" "public"."admin_profiles_role_enum" NOT NULL, "avatarId" integer, CONSTRAINT "REL_d1b5f61ecc9c83a766503b9eb7" UNIQUE ("userId"), CONSTRAINT "PK_d1b5f61ecc9c83a766503b9eb77" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "users_profiles" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "userName" character varying, "phoneNumber" character varying, "role" "public"."users_profiles_role_enum" NOT NULL DEFAULT 'newbie', "avatarId" integer, CONSTRAINT "REL_1cfade2944c4f57894eb1e4af3" UNIQUE ("userId"), CONSTRAINT "PK_e7a7f7db3fc96700d9239e43cda" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_games" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "gameId" integer NOT NULL, CONSTRAINT "PK_7373732a33c22813c5e06f4b4c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "games" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "message" text NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), "readAt" TIMESTAMP, "userId" integer NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), "stripeProductId" character varying NOT NULL, "stripePriceId" character varying NOT NULL, "moneyAmount" numeric(13,2) NOT NULL, "moneyCurrency" character(3) NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products_files" ("id" SERIAL NOT NULL, "fileName" character varying NOT NULL, "data" bytea NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_08ced89734a099b1cd8d648d383" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products_orders" ("id" SERIAL NOT NULL, "productId" integer NOT NULL, "userId" integer NOT NULL, "status" "public"."products_orders_status_enum" NOT NULL DEFAULT 'pending', "totalAmount" numeric(13,2) NOT NULL, "totalCurrency" character(3) NOT NULL, CONSTRAINT "PK_3d52ac8fcf7feac3be72b9cfd5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stripe_customers" ("stripeCustomerId" character varying NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), CONSTRAINT "REL_1471f71a3e248e6e76e0993b45" UNIQUE ("userId"), CONSTRAINT "PK_778a14299eaf933769fd8ea39ca" PRIMARY KEY ("stripeCustomerId"))`);
        await queryRunner.query(`CREATE TABLE "payment_methods" ("paymentMethodId" character varying NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), "userId" integer NOT NULL, "pmType" "public"."payment_methods_pmtype_enum" NOT NULL DEFAULT 'card', "lastNumbers" character varying NOT NULL, CONSTRAINT "PK_d7f5fbb8810fd2ce0f8394b3b52" PRIMARY KEY ("paymentMethodId"))`);
        await queryRunner.query(`CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "stripePaymentId" character varying NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending', "chargeAmount" numeric(13,2) NOT NULL, "chargeCurrency" character(3) NOT NULL, "userId" integer NOT NULL, "orderId" integer NOT NULL, "receiptUrl" character varying, CONSTRAINT "REL_af929a5f2a400fdb6913b4967e" UNIQUE ("orderId"), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users_files" ADD CONSTRAINT "FK_74cae0ea1fbb3df84c488ec0383" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admin_profiles" ADD CONSTRAINT "FK_d1b5f61ecc9c83a766503b9eb77" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_profiles" ADD CONSTRAINT "FK_1cfade2944c4f57894eb1e4af34" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_games" ADD CONSTRAINT "FK_dc7c369d193aa998e9f399d5575" FOREIGN KEY ("userId") REFERENCES "users_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_games" ADD CONSTRAINT "FK_37c737ad48e9b8c08209d38fab8" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_files" ADD CONSTRAINT "FK_d6143daa56b0a61c160ea9b15c5" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_orders" ADD CONSTRAINT "FK_56aeda267958a1512fc83b240b4" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_orders" ADD CONSTRAINT "FK_c4a5baa759b28d4f2c32868bc5f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stripe_customers" ADD CONSTRAINT "FK_1471f71a3e248e6e76e0993b45a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD CONSTRAINT "FK_580f1dbf7bceb9c2cde8baf7ff4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1" FOREIGN KEY ("orderId") REFERENCES "products_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_af929a5f2a400fdb6913b4967e1"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_d35cb3c13a18e1ea1705b2817b1"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP CONSTRAINT "FK_580f1dbf7bceb9c2cde8baf7ff4"`);
        await queryRunner.query(`ALTER TABLE "stripe_customers" DROP CONSTRAINT "FK_1471f71a3e248e6e76e0993b45a"`);
        await queryRunner.query(`ALTER TABLE "products_orders" DROP CONSTRAINT "FK_c4a5baa759b28d4f2c32868bc5f"`);
        await queryRunner.query(`ALTER TABLE "products_orders" DROP CONSTRAINT "FK_56aeda267958a1512fc83b240b4"`);
        await queryRunner.query(`ALTER TABLE "products_files" DROP CONSTRAINT "FK_d6143daa56b0a61c160ea9b15c5"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);
        await queryRunner.query(`ALTER TABLE "users_games" DROP CONSTRAINT "FK_37c737ad48e9b8c08209d38fab8"`);
        await queryRunner.query(`ALTER TABLE "users_games" DROP CONSTRAINT "FK_dc7c369d193aa998e9f399d5575"`);
        await queryRunner.query(`ALTER TABLE "users_profiles" DROP CONSTRAINT "FK_1cfade2944c4f57894eb1e4af34"`);
        await queryRunner.query(`ALTER TABLE "admin_profiles" DROP CONSTRAINT "FK_d1b5f61ecc9c83a766503b9eb77"`);
        await queryRunner.query(`ALTER TABLE "users_files" DROP CONSTRAINT "FK_74cae0ea1fbb3df84c488ec0383"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`DROP TABLE "payment_methods"`);
        await queryRunner.query(`DROP TABLE "stripe_customers"`);
        await queryRunner.query(`DROP TABLE "products_orders"`);
        await queryRunner.query(`DROP TABLE "products_files"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "games"`);
        await queryRunner.query(`DROP TABLE "users_games"`);
        await queryRunner.query(`DROP TABLE "users_profiles"`);
        await queryRunner.query(`DROP TABLE "admin_profiles"`);
        await queryRunner.query(`DROP TABLE "users_files"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
