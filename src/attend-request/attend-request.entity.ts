import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AttendRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  requesterEmail: string;

  @Column()
  requesteeEmail: string;

  @Column()
  eventId: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  date: string;
}
