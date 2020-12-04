import { MigrationInterface, QueryRunner } from 'typeorm';

export class IngredientInincial1607094663747 implements MigrationInterface {
  name = 'IngredientInincial1607094663747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ingredient" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" numeric(8,2) NOT NULL, "unit" character varying NOT NULL, CONSTRAINT "PK_6f1e945604a0b59f56a57570e98" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "ingredient"`);
  }
}
