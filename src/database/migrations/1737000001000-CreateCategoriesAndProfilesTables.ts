import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateCategoriesAndProfilesTables1737000001000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla categories
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Crear tabla profiles
    await queryRunner.createTable(
      new Table({
        name: 'profiles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'nombre',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'apellido',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'tipo_documento',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'numero_documento',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'categoria_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'familiar',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'contacto_familiar',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'parentezco',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'correo',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Crear foreign key de profiles a users
    await queryRunner.createForeignKey(
      'profiles',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Crear foreign key de profiles a categories
    await queryRunner.createForeignKey(
      'profiles',
      new TableForeignKey({
        columnNames: ['categoria_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar foreign keys
    const profilesTable = await queryRunner.getTable('profiles');
    if (profilesTable) {
      const foreignKeyUserId = profilesTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('user_id') !== -1,
      );
      if (foreignKeyUserId) {
        await queryRunner.dropForeignKey('profiles', foreignKeyUserId);
      }

      const foreignKeyCategoriaId = profilesTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('categoria_id') !== -1,
      );
      if (foreignKeyCategoriaId) {
        await queryRunner.dropForeignKey('profiles', foreignKeyCategoriaId);
      }
    }

    // Eliminar tablas
    await queryRunner.dropTable('profiles');
    await queryRunner.dropTable('categories');
  }
}
