import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductCity1607607466197 implements MigrationInterface {
    name = 'ProductCity1607607466197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "cityId" integer`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_39ac5ec6c6bd5d162c64e4b3e43" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_39ac5ec6c6bd5d162c64e4b3e43"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "cityId"`);
    }

}
