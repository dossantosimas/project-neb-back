import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class InitialSchema1768650211980 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Crear tabla users
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'username',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'role',
            type: 'int',
            default: 5, // USER
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: false,
          },
        ],
      }),
      true,
    );

    // 2. Crear tabla categories
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
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // 3. Crear tabla profiles
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
          },
          {
            name: 'profile_type',
            type: 'varchar',
          },
          {
            name: 'category_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'coach_profile_id',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // 4. Crear tabla coach_profiles
    await queryRunner.createTable(
      new Table({
        name: 'coach_profiles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'profile_id',
            type: 'int',
            isUnique: true,
          },
          {
            name: 'experience',
            type: 'int',
          },
          {
            name: 'team',
            type: 'varchar',
          },
        ],
      }),
      true,
    );

    // 5. Crear tabla player_profiles
    await queryRunner.createTable(
      new Table({
        name: 'player_profiles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'profile_id',
            type: 'int',
            isUnique: true,
          },
          {
            name: 'first_name',
            type: 'varchar',
          },
          {
            name: 'last_name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'document',
            type: 'varchar',
          },
          {
            name: 'document_type',
            type: 'varchar',
          },
          {
            name: 'birth_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'family_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'family_contact',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'relationship',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // 6. Crear tabla tournaments
    await queryRunner.createTable(
      new Table({
        name: 'tournaments',
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
          },
          {
            name: 'country',
            type: 'varchar',
          },
          {
            name: 'city',
            type: 'varchar',
          },
          {
            name: 'date',
            type: 'date',
          },
          {
            name: 'category_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // 7. Crear tabla matches
    await queryRunner.createTable(
      new Table({
        name: 'matches',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'tournament_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'opposing_team',
            type: 'varchar',
          },
          {
            name: 'home_score',
            type: 'int',
          },
          {
            name: 'away_score',
            type: 'int',
          },
          {
            name: 'country',
            type: 'varchar',
          },
          {
            name: 'city',
            type: 'varchar',
          },
          {
            name: 'date',
            type: 'date',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // 8. Crear tabla statistics
    await queryRunner.createTable(
      new Table({
        name: 'statistics',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'player_profile_id',
            type: 'int',
          },
          {
            name: 'match_id',
            type: 'int',
          },
          {
            name: 'points',
            type: 'int',
          },
          {
            name: 'rebounds',
            type: 'int',
          },
          {
            name: 'assists',
            type: 'int',
          },
          {
            name: 'steals',
            type: 'int',
          },
          {
            name: 'blocks',
            type: 'int',
          },
        ],
      }),
      true,
    );

    // 9. Crear tabla payments
    await queryRunner.createTable(
      new Table({
        name: 'payments',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'player_profile_id',
            type: 'int',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'debt',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'pending'",
          },
          {
            name: 'payment_method',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'payment_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Crear Foreign Keys
    // profiles -> users
    await queryRunner.createForeignKey(
      'profiles',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // profiles -> categories
    await queryRunner.createForeignKey(
      'profiles',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
      }),
    );

    // profiles -> coach_profiles
    await queryRunner.createForeignKey(
      'profiles',
      new TableForeignKey({
        columnNames: ['coach_profile_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'coach_profiles',
        onDelete: 'SET NULL',
      }),
    );

    // coach_profiles -> profiles
    await queryRunner.createForeignKey(
      'coach_profiles',
      new TableForeignKey({
        columnNames: ['profile_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'profiles',
        onDelete: 'CASCADE',
      }),
    );

    // player_profiles -> profiles
    await queryRunner.createForeignKey(
      'player_profiles',
      new TableForeignKey({
        columnNames: ['profile_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'profiles',
        onDelete: 'CASCADE',
      }),
    );

    // tournaments -> categories
    await queryRunner.createForeignKey(
      'tournaments',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
      }),
    );

    // matches -> tournaments
    await queryRunner.createForeignKey(
      'matches',
      new TableForeignKey({
        columnNames: ['tournament_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tournaments',
        onDelete: 'SET NULL',
      }),
    );

    // statistics -> player_profiles
    await queryRunner.createForeignKey(
      'statistics',
      new TableForeignKey({
        columnNames: ['player_profile_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'player_profiles',
        onDelete: 'CASCADE',
      }),
    );

    // statistics -> matches
    await queryRunner.createForeignKey(
      'statistics',
      new TableForeignKey({
        columnNames: ['match_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'matches',
        onDelete: 'CASCADE',
      }),
    );

    // payments -> player_profiles
    await queryRunner.createForeignKey(
      'payments',
      new TableForeignKey({
        columnNames: ['player_profile_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'player_profiles',
        onDelete: 'CASCADE',
      }),
    );

    // Crear índices únicos
    await queryRunner.createIndex(
      'statistics',
      new TableIndex({
        name: 'IDX_statistics_player_match',
        columnNames: ['player_profile_id', 'match_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar Foreign Keys primero
    const paymentsTable = await queryRunner.getTable('payments');
    if (paymentsTable) {
      const foreignKey = paymentsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('player_profile_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('payments', foreignKey);
      }
    }

    const statisticsTable = await queryRunner.getTable('statistics');
    if (statisticsTable) {
      const foreignKeys = statisticsTable.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('statistics', fk);
      }
    }

    const matchesTable = await queryRunner.getTable('matches');
    if (matchesTable) {
      const foreignKey = matchesTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('tournament_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('matches', foreignKey);
      }
    }

    const tournamentsTable = await queryRunner.getTable('tournaments');
    if (tournamentsTable) {
      const foreignKey = tournamentsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('category_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('tournaments', foreignKey);
      }
    }

    const playerProfilesTable = await queryRunner.getTable('player_profiles');
    if (playerProfilesTable) {
      const foreignKey = playerProfilesTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('profile_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('player_profiles', foreignKey);
      }
    }

    const coachProfilesTable = await queryRunner.getTable('coach_profiles');
    if (coachProfilesTable) {
      const foreignKey = coachProfilesTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('profile_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('coach_profiles', foreignKey);
      }
    }

    const profilesTable = await queryRunner.getTable('profiles');
    if (profilesTable) {
      const foreignKeys = profilesTable.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('profiles', fk);
      }
    }

    // Eliminar tablas en orden inverso
    await queryRunner.dropTable('payments', true);
    await queryRunner.dropTable('statistics', true);
    await queryRunner.dropTable('matches', true);
    await queryRunner.dropTable('tournaments', true);
    await queryRunner.dropTable('player_profiles', true);
    await queryRunner.dropTable('coach_profiles', true);
    await queryRunner.dropTable('profiles', true);
    await queryRunner.dropTable('categories', true);
    await queryRunner.dropTable('users', true);
  }
}
