import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefineFirstSchema1657210079628 implements MigrationInterface {
  name = 'DefineFirstSchema1657210079628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "login" character varying NOT NULL, "password" character varying, "email" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_profiles_role_enum" AS ENUM('newbie', 'subscriber', 'old-guard')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_profiles" ("userId" integer NOT NULL, "userName" character varying, "phoneNumber" character varying, "role" "public"."users_profiles_role_enum" NOT NULL DEFAULT 'newbie', "avatarId" integer, CONSTRAINT "REL_1cfade2944c4f57894eb1e4af3" UNIQUE ("userId"), CONSTRAINT "PK_1cfade2944c4f57894eb1e4af34" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_games" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "gameId" integer NOT NULL, CONSTRAINT "PK_7373732a33c22813c5e06f4b4c1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "games" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."admin_profiles_role_enum" AS ENUM('admin', 'super-admin', 'helper')`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin_profiles" ("userId" integer NOT NULL, "role" "public"."admin_profiles_role_enum" NOT NULL, "avatarId" integer, CONSTRAINT "REL_d1b5f61ecc9c83a766503b9eb7" UNIQUE ("userId"), CONSTRAINT "PK_d1b5f61ecc9c83a766503b9eb77" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_profiles" ADD CONSTRAINT "FK_1cfade2944c4f57894eb1e4af34" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_games" ADD CONSTRAINT "FK_dc7c369d193aa998e9f399d5575" FOREIGN KEY ("userId") REFERENCES "users_profiles"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_games" ADD CONSTRAINT "FK_37c737ad48e9b8c08209d38fab8" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_profiles" ADD CONSTRAINT "FK_d1b5f61ecc9c83a766503b9eb77" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_profiles" DROP CONSTRAINT "FK_d1b5f61ecc9c83a766503b9eb77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_games" DROP CONSTRAINT "FK_37c737ad48e9b8c08209d38fab8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_games" DROP CONSTRAINT "FK_dc7c369d193aa998e9f399d5575"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_profiles" DROP CONSTRAINT "FK_1cfade2944c4f57894eb1e4af34"`,
    );
    await queryRunner.query(`DROP TABLE "tokens"`);
    await queryRunner.query(`DROP TABLE "admin_profiles"`);
    await queryRunner.query(`DROP TYPE "public"."admin_profiles_role_enum"`);
    await queryRunner.query(`DROP TABLE "games"`);
    await queryRunner.query(`DROP TABLE "users_games"`);
    await queryRunner.query(`DROP TABLE "users_profiles"`);
    await queryRunner.query(`DROP TYPE "public"."users_profiles_role_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
