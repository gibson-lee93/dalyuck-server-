import { Calendar } from '../calendar/calendar.entity'
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';
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

  @ManyToMany(type => User, user => user.attendEvents, {
    cascade: true
  })
  @JoinTable({
    name: 'user_event'
  })
  users: User[];
}
