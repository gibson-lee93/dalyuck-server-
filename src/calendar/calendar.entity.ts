import { User } from '../user/user.entity';
import { Event } from '../event/event.entity';
import {
        BaseEntity,
        Entity,
        PrimaryGeneratedColumn,
        Column,
        ManyToOne,
        OneToMany
      } from 'typeorm';

@Entity()
export class Calendar extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  calendarName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'rgb(121, 134, 203)' })
  colour: string;

  @ManyToOne(type => User, user => user.calendar, {
    eager: false,
    onDelete: 'CASCADE'
  })
  user: User;

  @Column()
  userId: number;

  @OneToMany(type => Event, event => event.calendar, {
    eager: true,
    cascade: true
   })
  events: Event[];
}
