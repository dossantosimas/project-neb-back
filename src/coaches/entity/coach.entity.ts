import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Category } from '../../categories/entity/category.entity';
import { Player } from '../../players/entity/player.entity';

@Entity('coaches')
export class Coach {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  userId: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'document_type' })
  documentType: string;

  @Column()
  document: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relación 1:1 con User
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Relación N:M con Category (mantenida para compatibilidad temporal)
  @ManyToMany(() => Category)
  categories: Category[];

  // Relación 1:N con Player
  @OneToMany(() => Player, (player) => player.coach)
  players: Player[];
}
