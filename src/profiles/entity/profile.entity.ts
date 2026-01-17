import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Category } from '../../categories/entity/category.entity';
import { CoachProfile } from './coach-profile.entity';
import { PlayerProfile } from './player-profile.entity';

export enum ProfileType {
  PLAYER = 'player',
  COACH = 'coach',
  ADMIN = 'admin',
  OTHER = 'other',
}

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({
    name: 'profile_type',
    type: 'varchar',
    enum: ProfileType,
  })
  profileType: ProfileType;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number | null;

  @Column({ name: 'coach_profile_id', nullable: true })
  coachProfileId: number | null;

  // Relación N:1 con User
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Relación N:1 con Category
  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  // Relación N:1 con CoachProfile (solo para players, nullable para otros roles)
  @ManyToOne(() => CoachProfile, { nullable: true })
  @JoinColumn({ name: 'coach_profile_id' })
  coachProfile: CoachProfile | null;

  // Relación 1:1 con PlayerProfile (solo para players, nullable para otros roles)
  @OneToOne(() => PlayerProfile, (playerProfile) => playerProfile.profile, {
    nullable: true,
  })
  playerProfile: PlayerProfile | null;

  // Relación 1:1 con CoachProfile (solo para coaches, nullable para otros roles)
  @OneToOne(() => CoachProfile, (coachProfile) => coachProfile.profile, {
    nullable: true,
  })
  coachProfileDetail: CoachProfile | null;
}
