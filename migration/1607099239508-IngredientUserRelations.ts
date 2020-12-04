import { MigrationInterface, QueryRunner } from 'typeorm';

export class IngredientUserRelations1607099239508
  implements MigrationInterface {
  name = 'IngredientUserRelations1607099239508';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ingredient" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "ingredient" ADD CONSTRAINT "FK_d621784b59b05016938180fb3bb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ingredient" DROP CONSTRAINT "FK_d621784b59b05016938180fb3bb"`,
    );
    await queryRunner.query(`ALTER TABLE "ingredient" DROP COLUMN "userId"`);
  }
}
