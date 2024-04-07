import {DataSource, EntitySubscriberInterface, EventSubscriber} from 'typeorm';
import {InjectDataSource} from '@nestjs/typeorm';
import {EventEmitter2} from '@nestjs/event-emitter';

/**
 * This is a subscriber that listens to all events that happen in the database.
 * Propagates the event to the event emitter so it can be caught by event handlers
 */
@EventSubscriber()
export class AllSubscriber implements EntitySubscriberInterface {
  constructor(
    @InjectDataSource() readonly connection: DataSource,
    private eventEmitter: EventEmitter2
  ) {
    // Register this subscriber to listen to all entities.
    connection.subscribers.push(this);
  }

  afterInsert() {
    this.eventEmitter.emit('database-change');
  }

  afterUpdate() {
    this.eventEmitter.emit('database-change');
  }

  afterRemove() {
    this.eventEmitter.emit('database-change');
  }

  afterSoftRemove() {
    this.eventEmitter.emit('database-change');
  }
}
