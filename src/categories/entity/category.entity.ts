import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Profile } from '../../profiles/entity/profile.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @ManyToMany(() => Profile, (profile) => profile.categories)
  profiles: Profile[];
}
