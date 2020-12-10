import {MigrationInterface, QueryRunner} from "typeorm";

export class UserCity1607593911105 implements MigrationInterface {
    name = 'UserCity1607593911105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "document_weights_idx"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "cityId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_beb5846554bec348f6baf449e83" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_beb5846554bec348f6baf449e83"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "cityId"`);
        await queryRunner.query(`CREATE INDEX "document_weights_idx" ON "city" ("document_with_weights") `);
    }

}
