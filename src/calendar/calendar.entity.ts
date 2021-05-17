import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
