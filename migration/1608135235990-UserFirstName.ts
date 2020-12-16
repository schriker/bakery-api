import {MigrationInterface, QueryRunner} from "typeorm";

export class UserFirstName1608135235990 implements MigrationInterface {
    name = 'UserFirstName1608135235990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."firstName" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "user"."firstName" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" DROP NOT NULL`);
    }

}
