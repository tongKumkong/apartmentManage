/**
 * Command model events
 */

'use strict';

import { EventEmitter } from 'events';
var CommandEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CommandEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Command) {
  for (var e in events) {
    let event = events[e];
    Command.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    CommandEvents.emit(event + ':' + doc._id, doc);
    CommandEvents.emit(event, doc);
  };
}

export { registerEvents };
export default CommandEvents;
