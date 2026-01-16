import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Tournament } from '../../tournaments/entity/tournament.entity';
import { Statistics } from '../../statistics/entity/statistics.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'match_date', type: 'date' })
  matchDate: Date;

  @Column({ name: 'match_time', type: 'time', nullable: true })
  matchTime: string | null;

  @Column({ name: 'is_friendly', type: 'boolean', default: false })
  isFriendly: boolean;

  @Column({ name: 'tournament_id', type: 'uuid', nullable: true })
  tournamentId: string | null;

  @Column({ name: 'home_team_id', type: 'uuid' })
  homeTeamId: string;

  @Column({ name: 'away_team_id', type: 'uuid' })
  awayTeamId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string | null;

  @Column({ type: 'varchar', length: 20, default: 'scheduled' })
  status: string; // scheduled / finished / canceled

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relación N:1 con Tournament
  @ManyToOne(() => Tournament, (tournament) => tournament.matches)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament | null;

  // Relación 1:N con Statistics
  @OneToMany(() => Statistics, (statistics) => statistics.match)
  statistics: Statistics[];
}
