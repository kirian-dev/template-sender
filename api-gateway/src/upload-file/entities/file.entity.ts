import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { StatusFile } from "../types";
import { Exclude } from 'class-transformer';
@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  pending_emails: number;

  @Column({ default: 0 })
  success_emails: number;

  @Column({ default: 0 })
  failed_emails: number;

  @Column()
  userId: number;

  @Column({ default: "loading" })
  status: StatusFile;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date | null;

  @Column()
  emailText: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
  @Exclude()
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
