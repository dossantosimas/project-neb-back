import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
} from 'typeorm';

export class AddRoleToUsers1736200000000 implements MigrationInterface {
  name = 'AddRoleToUsers1736200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar columna role a la tabla users
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'role',
        type: 'varchar',
        default: "'user'",
        isNullable: false,
      }),
    );

    // Actualizar usuarios existentes que no tengan rol asignado
    await queryRunner.query(
      `UPDATE "users" SET "role" = 'user' WHERE "role" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'role');
  }
}
