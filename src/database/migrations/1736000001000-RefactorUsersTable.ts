import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class RefactorUsersTable1736000001000 implements MigrationInterface {
  name = 'RefactorUsersTable1736000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if table exists and has old columns
    const table = await queryRunner.getTable('users');
    if (!table) {
      return;
    }

    // Drop old foreign keys first
    const foreignKeys = table.foreignKeys.filter((fk) =>
      fk.columnNames.includes('coach_id'),
    );
    for (const fk of foreignKeys) {
      await queryRunner.dropForeignKey('users', fk);
    }

    // First, handle the 'user' column - rename it to 'username' if it exists
    const usernameColumn = table.findColumnByName('username');
    const userColumn = table.findColumnByName('user');
    
    if (!usernameColumn && userColumn) {
      // Rename 'user' column to 'username'
      await queryRunner.renameColumn('users', 'user', 'username');
    } else if (!usernameColumn && !userColumn) {
      // Create username column as nullable first, then populate it
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'username',
          type: 'varchar',
          isNullable: true, // Start as nullable
        }),
      );
      
      // Populate username with a default value based on id for existing rows
      await queryRunner.query(
        `UPDATE "users" SET "username" = 'user_' || id::text WHERE "username" IS NULL`,
      );
      
      // Now make it NOT NULL and add unique constraint
      await queryRunner.changeColumn(
        'users',
        'username',
        new TableColumn({
          name: 'username',
          type: 'varchar',
          isNullable: false,
          isUnique: true,
        }),
      );
    } else if (usernameColumn && usernameColumn.isNullable) {
      // username exists but is nullable - populate and fix
      await queryRunner.query(
        `UPDATE "users" SET "username" = 'user_' || id::text WHERE "username" IS NULL`,
      );
      await queryRunner.changeColumn(
        'users',
        'username',
        new TableColumn({
          name: 'username',
          type: 'varchar',
          isNullable: false,
          isUnique: true,
        }),
      );
    }

    // Drop old columns (if they exist) - exclude 'user' since we already handled it
    const columnsToDrop = [
      'nombre',
      'apellido',
      'email',
      'rol',
      'documento',
      'tipo_documento',
      'fecha_nacimiento',
      'familiar',
      'parentezco',
      'creado',
      'actualizado',
      'categoria',
      'is_active',
      'coach_id',
      'name',
      'lastname',
    ];

    for (const columnName of columnsToDrop) {
      const column = table.findColumnByName(columnName);
      if (column) {
        await queryRunner.dropColumn('users', columnName);
      }
    }

    // Ensure username has unique constraint
    const updatedTable = await queryRunner.getTable('users');
    if (updatedTable) {
      const usernameIndex = updatedTable.indices.find(
        (idx) => idx.columnNames.includes('username'),
      );
      if (!usernameIndex) {
        await queryRunner.createIndex(
          'users',
          new TableIndex({
            name: 'IDX_users_username',
            columnNames: ['username'],
            isUnique: true,
          }),
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Note: This down migration doesn't restore old columns
    // as we don't have the data. This is intentional for a redesign.
    const table = await queryRunner.getTable('users');
    if (!table) {
      return;
    }

    const usernameIndex = table.indices.find(
      (idx) => idx.name === 'IDX_users_username',
    );
    if (usernameIndex) {
      await queryRunner.dropIndex('users', 'IDX_users_username');
    }
  }
}
