import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class RequestEmail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  requestId: number;

  @Column()
  respondId: number;

  @Column({ nullable: true })
  calendarId: number;
}
