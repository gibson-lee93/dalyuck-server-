import { Calendar } from '../calendar/calendar.entity'
import { Notification } from '../notification/notification.entity';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  eventName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'rgb(121, 134, 203)' })
  colour: string;

  @Column({
    type: 'boolean',
    default: false
  })
  access: boolean;

  @Column({ nullable: true })
  location: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @ManyToOne(type => Calendar, calendar => calendar.events, {
    eager: false,
    onDelete: 'CASCADE'
   })
  calendar: Calendar;

  @Column()
  calendarId: number;

  @OneToMany(type => Notification, notification => notification.event, {
    eager: true,
    cascade: true
   })
  notifications: Notification[];
}
