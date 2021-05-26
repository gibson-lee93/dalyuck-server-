import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class RequestEmail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  requesterEmail: string;

  @Column()
  requesteeEmail: string;

  @Column({ nullable: true })
  calendarId: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  date: string;
}
