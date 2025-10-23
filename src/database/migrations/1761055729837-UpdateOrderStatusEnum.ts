import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderStatusEnum1761055729837 implements MigrationInterface {
    name = 'UpdateOrderStatusEnum1761055729837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`status\` \`status\` enum ('pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`rating\` \`rating\` int(1) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`rating\` \`rating\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`status\` \`status\` enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending'`);
    }

}
