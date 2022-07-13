import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeFKUsersGamesToUser1657702659091
  implements MigrationInterface
{
  name = 'ChangeFKUsersGamesToUser1657702659091';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_games" DROP CONSTRAINT "FK_dc7c369d193aa998e9f399d5575"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_games" ADD CONSTRAINT "FK_dc7c369d193aa998e9f399d5575" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_games" DROP CONSTRAINT "FK_dc7c369d193aa998e9f399d5575"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_games" ADD CONSTRAINT "FK_dc7c369d193aa998e9f399d5575" FOREIGN KEY ("userId") REFERENCES "users_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
