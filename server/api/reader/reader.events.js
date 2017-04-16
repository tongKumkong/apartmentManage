/**
 * Reader model events
 */

'use strict';

import { EventEmitter } from 'events';
var ReaderEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ReaderEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Reader) {
  for (var e in events) {
    let event = events[e];
    Reader.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    ReaderEvents.emit(event + ':' + doc._id, doc);
    ReaderEvents.emit(event, doc);
  };
}

export { registerEvents };
export default ReaderEvents;
