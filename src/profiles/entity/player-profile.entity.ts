import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Payment } from '../../payments/entity/payment.entity';
import { Statistics } from '../../statistics/entity/statistics.entity';

@Entity('player_profiles')
export class PlayerProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'profile_id', unique: true })
  profileId: number;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  document: string;

  @Column({ name: 'document_type', type: 'varchar' })
  documentType: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date | null;

  @Column({ name: 'family_name', type: 'varchar', nullable: true })
  familyName: string | null;

  @Column({ name: 'family_contact', type: 'varchar', nullable: true })
  familyContact: string | null;

  @Column({ type: 'varchar', nullable: true })
  relationship: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relación 1:1 con Profile
  @OneToOne(() => Profile, (profile) => profile.playerProfile)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  // Relación 1:N con Payment
  @OneToMany(() => Payment, (payment) => payment.player)
  payments: Payment[];

  // Relación 1:N con Statistics
  @OneToMany(() => Statistics, (statistics) => statistics.player)
  statistics: Statistics[];
}
