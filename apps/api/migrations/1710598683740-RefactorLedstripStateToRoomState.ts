import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorLedstripStateToRoomState1710598683740 implements MigrationInterface {
    name = 'RefactorLedstripStateToRoomState1710598683740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device\` DROP COLUMN \`state\``);
        await queryRunner.query(`ALTER TABLE \`room\` ADD \`state\` text NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`room\` DROP COLUMN \`state\``);
        await queryRunner.query(`ALTER TABLE \`device\` ADD \`state\` text NOT NULL DEFAULT '{}'`);
    }

}
