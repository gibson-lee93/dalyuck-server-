import { User } from 'src/user/user.entity';
import { 
        BaseEntity, 
        Entity, 
        PrimaryGeneratedColumn, 
        Column,
        ManyToOne 
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

  @ManyToOne(type => User, user => user.calendar, { eager: false })
  user: User;

  @Column()
  userId: number;
}
