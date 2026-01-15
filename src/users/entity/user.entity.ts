import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  MASTER = 'master',
  ADMIN = 'admin',
  COACH = 'coach',
  PLAYER = 'player',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'varchar',
    default: UserRole.USER,
  })
  role: string;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Solo hashear si la contraseña es nueva o ha cambiado
    // Verificar si la contraseña parece estar ya hasheada (los hashes de bcrypt tienen un formato específico)
    if (this.password && !this.password.startsWith('$2b$') && !this.password.startsWith('$2a$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
