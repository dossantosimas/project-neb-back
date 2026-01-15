import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Coach } from '../../coaches/entity/coach.entity';
import { Player } from '../../players/entity/player.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relación N:M con Coach
  @ManyToMany(() => Coach, (coach) => coach.categories)
  @JoinTable({
    name: 'coach_categories',
    joinColumn: { name: 'category_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'coach_id', referencedColumnName: 'id' },
  })
  coaches: Coach[];

  // Relación 1:N con Player
  @OneToMany(() => Player, (player) => player.category)
  players: Player[];
}
