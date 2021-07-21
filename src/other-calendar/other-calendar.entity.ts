import { User } from '../user/user.entity';
import { OtherEvent } from '../other-event/other-event.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany
} from 'typeorm';

@Entity()
export class OtherCalendar extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  calendarName: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  colour: string;

  @ManyToOne(type => User, user => user.otherCalendars, {
    eager: false,
    onDelete: 'CASCADE'
  })
  user: User;

  @Column()
  userId: number;

  @OneToMany(type => OtherEvent, otherEvent => otherEvent.otherCalendar, {
    eager: true,
    cascade: true
   })
  otherEvents: OtherEvent[];
}
