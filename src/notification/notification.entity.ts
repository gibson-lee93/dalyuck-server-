import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Event } from '../event/event.entity';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp" })
  alarm: string;

  @ManyToOne(type => Event, event => event.notifications, {
    eager: false,
    onDelete: 'CASCADE'
   })
  event: Event;

  @Column()
  eventId: number;
}
