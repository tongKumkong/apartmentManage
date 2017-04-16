/**
 * HistoryElectric model events
 */

'use strict';

import { EventEmitter } from 'events';
var HistoryElectricEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
HistoryElectricEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(HistoryElectric) {
  for (var e in events) {
    let event = events[e];
    HistoryElectric.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    HistoryElectricEvents.emit(event + ':' + doc._id, doc);
    HistoryElectricEvents.emit(event, doc);
  };
}

export { registerEvents };
export default HistoryElectricEvents;
