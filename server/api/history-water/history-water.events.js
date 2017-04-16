/**
 * HistoryWater model events
 */

'use strict';

import { EventEmitter } from 'events';
var HistoryWaterEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
HistoryWaterEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(HistoryWater) {
  for (var e in events) {
    let event = events[e];
    HistoryWater.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function (doc) {
    HistoryWaterEvents.emit(event + ':' + doc._id, doc);
    HistoryWaterEvents.emit(event, doc);
  };
}

export { registerEvents };
export default HistoryWaterEvents;
