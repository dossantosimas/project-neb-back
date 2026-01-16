import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Category } from '../../categories/entity/category.entity';
import { Coach } from '../../coaches/entity/coach.entity';
import { Payment } from '../../payments/entity/payment.entity';
import { Statistics } from '../../statistics/entity/statistics.entity';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  userId: number;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number | null;

  @Column({ name: 'coach_id', nullable: true })
  coachId: number | null;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column()
  document: string;

  @Column({ name: 'document_type' })
  documentType: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date | null;

  @Column({ name: 'family_contact', type: 'varchar', nullable: true })
  familyContact: string | null;

  @Column({ type: 'varchar', nullable: true })
  relationship: string | null;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relación 1:1 con User
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Relación N:1 con Category
  @ManyToOne(() => Category, (category) => category.players)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // Relación N:1 con Coach
  @ManyToOne(() => Coach, (coach) => coach.players)
  @JoinColumn({ name: 'coach_id' })
  coach: Coach;

  // Relación 1:N con Payment
  @OneToMany(() => Payment, (payment) => payment.player)
  payments: Payment[];

  // Relación 1:N con Statistics
  @OneToMany(() => Statistics, (statistics) => statistics.player)
  statistics: Statistics[];
}
