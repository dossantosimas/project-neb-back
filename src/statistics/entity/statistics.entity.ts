import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Player } from '../../players/entity/player.entity';
import { Match } from '../../matches/entity/match.entity';

@Entity('statistics')
export class Statistics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'player_id', type: 'int' })
  playerId: number;

  @Column({ name: 'match_id', type: 'uuid' })
  matchId: string;

  @Column({ name: 'minutes_played', type: 'int' })
  minutesPlayed: number;

  @Column({ type: 'int' })
  points: number;

  @Column({ name: 'fg_made', type: 'int' })
  fgMade: number;

  @Column({ name: 'fg_attempted', type: 'int' })
  fgAttempted: number;

  @Column({ name: 'three_made', type: 'int' })
  threeMade: number;

  @Column({ name: 'three_attempted', type: 'int' })
  threeAttempted: number;

  @Column({ name: 'ft_made', type: 'int' })
  ftMade: number;

  @Column({ name: 'ft_attempted', type: 'int' })
  ftAttempted: number;

  @Column({ name: 'rebounds_offensive', type: 'int' })
  reboundsOffensive: number;

  @Column({ name: 'rebounds_defensive', type: 'int' })
  reboundsDefensive: number;

  @Column({ type: 'int' })
  assists: number;

  @Column({ type: 'int' })
  steals: number;

  @Column({ type: 'int' })
  blocks: number;

  @Column({ type: 'int' })
  turnovers: number;

  @Column({ type: 'int' })
  fouls: number;

  // Campos adicionales opcionales
  @Column({ name: 'plus_minus', type: 'int', nullable: true })
  plusMinus: number | null;

  @Column({ type: 'boolean', nullable: true })
  starter: boolean | null;

  @Column({ name: 'position_played', type: 'varchar', length: 5, nullable: true })
  positionPlayed: string | null; // PG / SG / SF / PF / C

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relación N:1 con Player
  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  // Relación N:1 con Match
  @ManyToOne(() => Match, (match) => match.statistics)
  @JoinColumn({ name: 'match_id' })
  match: Match;
}
