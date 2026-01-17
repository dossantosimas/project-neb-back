import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Match } from '../../matches/entity/match.entity';
import { Category } from '../../categories/entity/category.entity';

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // Relación N:1 con Category
  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  // Relación 1:N con Match
  @OneToMany(() => Match, (match) => match.tournament)
  matches: Match[];
}
