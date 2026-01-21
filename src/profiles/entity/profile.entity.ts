import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Category } from '../../categories/entity/category.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  userId: number;

  @Column({ name: 'nombre', type: 'varchar' })
  nombre: string;

  @Column({ name: 'apellido', type: 'varchar' })
  apellido: string;

  @Column({ name: 'tipo_documento', type: 'varchar' })
  tipoDocumento: string;

  @Column({ name: 'numero_documento', type: 'varchar' })
  numeroDocumento: string;

  @Column({ name: 'familiar', type: 'varchar', nullable: true })
  familiar: string | null;

  @Column({ name: 'contacto_familiar', type: 'varchar', nullable: true })
  contactoFamiliar: string | null;

  @Column({ name: 'parentezco', type: 'varchar', nullable: true })
  parentezco: string | null;

  @Column({ name: 'correo', type: 'varchar', nullable: true })
  correo: string | null;

  // Relación 1:1 con User
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Relación ManyToMany con Category (un perfil puede pertenecer a varias categorías)
  @ManyToMany(() => Category, (category) => category.profiles, { cascade: false })
  @JoinTable({
    name: 'profile_categories',
    joinColumn: { name: 'profile_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];
}
