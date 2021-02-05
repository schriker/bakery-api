import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductSlugUniqueWithIndex1612270201607 implements MigrationInterface {
    name = 'ProductSlugUniqueWithIndex1612270201607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8cfaf4a1e80806d58e3dbe6922" ON "product" ("slug") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_8cfaf4a1e80806d58e3dbe6922"`);
    }

}
