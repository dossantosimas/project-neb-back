import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Category } from '../../categories/entity/category.entity';

@Entity('coach_profiles')
export class CoachProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'profile_id', unique: true })
  profileId: number;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string;

  @Column({ name: 'document_type', type: 'varchar' })
  documentType: string;

  @Column({ type: 'varchar', nullable: true })
  document: string | null;

  // Relación 1:1 con Profile
  @OneToOne(() => Profile, (profile) => profile.coachProfile)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  // Relación N:M con Category (un entrenador puede tener varias categorías)
  @ManyToMany(() => Category, (category) => category.coachProfiles)
  @JoinTable({
    name: 'coach_profile_categories',
    joinColumn: { name: 'coach_profile_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];
}
