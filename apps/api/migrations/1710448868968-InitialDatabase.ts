import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDatabase1710448868968 implements MigrationInterface {
    name = 'InitialDatabase1710448868968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`device\` (\`id\` uuid NOT NULL, \`socketSessionId\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`state\` text NOT NULL DEFAULT '{}', \`isLedstrip\` tinyint NOT NULL DEFAULT 1, \`isConnected\` tinyint NOT NULL, \`roomId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`room\` (\`id\` uuid NOT NULL, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`UniqueRoomName\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`device\` ADD CONSTRAINT \`FK_2f6b7d1366bd53dc977d1aeb2bb\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device\` DROP FOREIGN KEY \`FK_2f6b7d1366bd53dc977d1aeb2bb\``);
        await queryRunner.query(`DROP INDEX \`UniqueRoomName\` ON \`room\``);
        await queryRunner.query(`DROP TABLE \`room\``);
        await queryRunner.query(`DROP TABLE \`device\``);
    }

}
