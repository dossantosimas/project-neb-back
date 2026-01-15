import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateUserTable1735900000000 implements MigrationInterface {
  name = 'UpdateUserTable1735900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Renombrar columnas existentes
    await queryRunner.renameColumn('users', 'name', 'nombre');
    await queryRunner.renameColumn('users', 'lastname', 'apellido');

    // Agregar nuevas columnas
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'user',
        type: 'varchar',
        isUnique: true,
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'rol',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'documento',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'tipo_documento',
        type: 'varchar',
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'fecha_nacimiento',
        type: 'date',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'familiar',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'parentezco',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'creado',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'actualizado',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar columnas agregadas
    await queryRunner.dropColumn('users', 'actualizado');
    await queryRunner.dropColumn('users', 'creado');
    await queryRunner.dropColumn('users', 'parentezco');
    await queryRunner.dropColumn('users', 'familiar');
    await queryRunner.dropColumn('users', 'fecha_nacimiento');
    await queryRunner.dropColumn('users', 'tipo_documento');
    await queryRunner.dropColumn('users', 'documento');
    await queryRunner.dropColumn('users', 'rol');
    await queryRunner.dropColumn('users', 'user');

    // Renombrar columnas de vuelta
    await queryRunner.renameColumn('users', 'apellido', 'lastname');
    await queryRunner.renameColumn('users', 'nombre', 'name');
  }
}
