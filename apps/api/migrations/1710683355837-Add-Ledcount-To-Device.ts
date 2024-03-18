import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLedcountToDevice1710683355837 implements MigrationInterface {
    name = 'AddLedcountToDevice1710683355837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device\` ADD \`ledCount\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device\` DROP COLUMN \`ledCount\``);
    }

}
