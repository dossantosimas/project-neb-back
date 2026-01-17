import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

// Roles: 1: master, 2: admin, 3: coach, 4: player
export enum UserRole {
  MASTER = 1,
  ADMIN = 2,
  COACH = 3,
  PLAYER = 4,
  USER = 5, // Rol por defecto para usuarios genéricos
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
    type: 'int',
    default: UserRole.USER,
  })
  role: number; // 1: master, 2: admin, 3: coach, 4: player

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  // Relación 1:N con Profile
  @OneToMany('Profile', 'user')
  profiles: any[];

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
