import { OtherEvent } from './other-event.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(OtherEvent)
export class OtherEventRepository extends Repository<OtherEvent> {}
