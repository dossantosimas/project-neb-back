import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Tournament } from '../../tournaments/entity/tournament.entity';
import { Statistics } from '../../statistics/entity/statistics.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tournament_id', nullable: true })
  tournamentId: number | null;

  @Column({ name: 'opposing_team' })
  opposingTeam: string;

  @Column({ name: 'home_score' })
  homeScore: number;

  @Column({ name: 'away_score' })
  awayScore: number;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // Relación N:1 con Tournament
  @ManyToOne(() => Tournament, (tournament) => tournament.matches)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament | null;

  // Relación 1:N con Statistics
  @OneToMany(() => Statistics, (statistics) => statistics.match)
  statistics: Statistics[];
}
