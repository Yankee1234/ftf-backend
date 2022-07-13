import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveForeignKeyToGamesInUserProfile1657702310670
  implements MigrationInterface
{
  name = 'RemoveForeignKeyToGamesInUserProfile1657702310670';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_profiles" DROP CONSTRAINT "FK_d1b5f61ecc9c83a766503b9eb77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_profiles" ADD CONSTRAINT "UQ_d1b5f61ecc9c83a766503b9eb77" UNIQUE ("userId")`,
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
      `ALTER TABLE "admin_profiles" DROP CONSTRAINT "UQ_d1b5f61ecc9c83a766503b9eb77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_profiles" ADD CONSTRAINT "FK_d1b5f61ecc9c83a766503b9eb77" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
