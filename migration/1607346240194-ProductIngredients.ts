import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductIngredients1607346240194 implements MigrationInterface {
    name = 'ProductIngredients1607346240194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "productIngredient" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "count" integer NOT NULL, "userId" integer, "productId" integer, "ingredientId" integer, CONSTRAINT "PK_7b5ec53f8831f26c24ab6cdc3ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_165a52c7b097252aca93739ab35" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_eb207642da5918780cab878ff3d" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productIngredient" ADD CONSTRAINT "FK_f310bb782ee3e7507b8c1ca243d" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_f310bb782ee3e7507b8c1ca243d"`);
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_eb207642da5918780cab878ff3d"`);
        await queryRunner.query(`ALTER TABLE "productIngredient" DROP CONSTRAINT "FK_165a52c7b097252aca93739ab35"`);
        await queryRunner.query(`DROP TABLE "productIngredient"`);
    }

}
