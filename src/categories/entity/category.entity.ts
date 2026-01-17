import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Profile } from '../../profiles/entity/profile.entity';
import { Tournament } from '../../tournaments/entity/tournament.entity';
import { CoachProfile } from '../../profiles/entity/coach-profile.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relación 1:N con Profile
  @OneToMany(() => Profile, (profile) => profile.category)
  profiles: Profile[];

  // Relación 1:N con Tournament
  @OneToMany(() => Tournament, (tournament) => tournament.category)
  tournaments: Tournament[];

  // Relación N:M con CoachProfile (muchas categorías pueden tener muchos entrenadores)
  @ManyToMany(() => CoachProfile, (coachProfile) => coachProfile.categories)
  coachProfiles: CoachProfile[];
}
