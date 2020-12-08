import { MigrationInterface, QueryRunner } from 'typeorm';

export class OnDeleteProductIngredientCascade1607355799624
  implements MigrationInterface {
  name = 'OnDeleteProductIngredientCascade1607355799624';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_165a52c7b097252aca93739ab35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_f310bb782ee3e7507b8c1ca243d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_165a52c7b097252aca93739ab35" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_f310bb782ee3e7507b8c1ca243d" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_f310bb782ee3e7507b8c1ca243d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_165a52c7b097252aca93739ab35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_f310bb782ee3e7507b8c1ca243d" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_165a52c7b097252aca93739ab35" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
