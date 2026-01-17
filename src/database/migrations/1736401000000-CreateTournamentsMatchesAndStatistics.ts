import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateTournamentsMatchesAndStatistics1736401000000
  implements MigrationInterface
{
  name = 'CreateTournamentsMatchesAndStatistics1736401000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create tournaments table if it doesn't exist
    const tournamentsTable = await queryRunner.getTable('tournaments');
    if (!tournamentsTable) {
      await queryRunner.createTable(
      new Table({
        name: 'tournaments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'season',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'category',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'start_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'end_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'location',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            isNullable: false,
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
          },
        ],
      }),
        true,
      );
    }

    // 2. Create matches table if it doesn't exist
    const matchesTable = await queryRunner.getTable('matches');
    if (!matchesTable) {
      await queryRunner.createTable(
      new Table({
        name: 'matches',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'match_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'match_time',
            type: 'time',
            isNullable: true,
          },
          {
            name: 'is_friendly',
            type: 'boolean',
            default: false,
          },
          {
            name: 'tournament_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'home_team_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'away_team_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'location',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'scheduled'",
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
          },
        ],
      }),
        true,
      );
    }

    // Add foreign key from matches to tournaments if it doesn't exist
    const matchesTableAfter = await queryRunner.getTable('matches');
    if (matchesTableAfter) {
      const foreignKeyExists = matchesTableAfter.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('tournament_id') !== -1,
      );
      if (!foreignKeyExists) {
        await queryRunner.createForeignKey(
      'matches',
      new TableForeignKey({
        columnNames: ['tournament_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tournaments',
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        }),
      );
    }
    }

    // 3. Create statistics table if it doesn't exist
    const statisticsTable = await queryRunner.getTable('statistics');
    if (!statisticsTable) {
      await queryRunner.createTable(
      new Table({
        name: 'statistics',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'player_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'match_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'minutes_played',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'points',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'fg_made',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'fg_attempted',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'three_made',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'three_attempted',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'ft_made',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'ft_attempted',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'rebounds_offensive',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'rebounds_defensive',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'assists',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'steals',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'blocks',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'turnovers',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'fouls',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'plus_minus',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'starter',
            type: 'boolean',
            isNullable: true,
          },
          {
            name: 'position_played',
            type: 'varchar',
            length: '5',
            isNullable: true,
          },
          {
            name: 'comment',
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
          },
        ],
      }),
        true,
      );
    }

    // Add foreign keys from statistics if they don't exist
    const statisticsTableAfter = await queryRunner.getTable('statistics');
    if (statisticsTableAfter) {
      // Add foreign key to players
      const fkPlayerExists = statisticsTableAfter.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('player_id') !== -1,
      );
      if (!fkPlayerExists) {
        await queryRunner.createForeignKey(
      'statistics',
      new TableForeignKey({
        columnNames: ['player_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'players',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      );
    }

      // Add foreign key to matches
      const fkMatchExists = statisticsTableAfter.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('match_id') !== -1,
      );
      if (!fkMatchExists) {
        await queryRunner.createForeignKey(
      'statistics',
      new TableForeignKey({
        columnNames: ['match_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'matches',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        }),
      );
    }

      // Add unique index for player_id and match_id combination if it doesn't exist
      const indexExists = statisticsTableAfter.indices.find(
        (idx) => idx.name === 'IDX_statistics_player_match',
      );
      if (!indexExists) {
        await queryRunner.createIndex(
      'statistics',
      new TableIndex({
        name: 'IDX_statistics_player_match',
          columnNames: ['player_id', 'match_id'],
          isUnique: true,
        }),
      );
    }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    const statisticsTable = await queryRunner.getTable('statistics');
    if (statisticsTable) {
      const foreignKeys = statisticsTable.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('statistics', fk);
      }
    }

    const matchesTable = await queryRunner.getTable('matches');
    if (matchesTable) {
      const foreignKeys = matchesTable.foreignKeys;
      for (const fk of foreignKeys) {
        await queryRunner.dropForeignKey('matches', fk);
      }
    }

    // Drop tables in reverse order
    await queryRunner.dropTable('statistics');
    await queryRunner.dropTable('matches');
    await queryRunner.dropTable('tournaments');
  }
}
