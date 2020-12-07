import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductDelete1607355351282 implements MigrationInterface {
  name = 'ProductDelete1607355351282';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_eb207642da5918780cab878ff3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_eb207642da5918780cab878ff3d" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_eb207642da5918780cab878ff3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_eb207642da5918780cab878ff3d" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
