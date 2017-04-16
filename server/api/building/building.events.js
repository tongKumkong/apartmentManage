/**
 * Building model events
 */

'use strict';

import {EventEmitter} from 'events';
var BuildingEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BuildingEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Building) {
  for(var e in events) {
    let event = events[e];
    Building.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    BuildingEvents.emit(`${event}:${doc._id}`, doc);
    BuildingEvents.emit(event, doc);
  };
}

export {registerEvents};
export default BuildingEvents;
