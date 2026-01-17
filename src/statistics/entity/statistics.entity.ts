import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PlayerProfile } from '../../profiles/entity/player-profile.entity';
import { Match } from '../../matches/entity/match.entity';

@Entity('statistics')
export class Statistics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'player_profile_id' })
  playerProfileId: number;

  @Column({ name: 'match_id' })
  matchId: number;

  @Column({ type: 'int' })
  points: number;

  @Column({ type: 'int' })
  rebounds: number;

  @Column({ type: 'int' })
  assists: number;

  @Column({ type: 'int' })
  steals: number;

  @Column({ type: 'int' })
  blocks: number;

  // Relación N:1 con PlayerProfile
  @ManyToOne(() => PlayerProfile)
  @JoinColumn({ name: 'player_profile_id' })
  player: PlayerProfile;

  // Relación N:1 con Match
  @ManyToOne(() => Match, (match) => match.statistics)
  @JoinColumn({ name: 'match_id' })
  match: Match;
}
