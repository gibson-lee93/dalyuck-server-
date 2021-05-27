import { OtherCalendar } from '../other-calendar/other-calendar.entity';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class OtherEvent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  eventName: string;

  @Column({ nullable: true })
  description: string;

  @Column()
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

  @ManyToOne(type => OtherCalendar, otherCalendar => otherCalendar.otherEvents, {
    eager: false,
    onDelete: 'CASCADE'
   })
  otherCalendar: OtherCalendar;

  @Column()
  otherCalendarId: number;
}
