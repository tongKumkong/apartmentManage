'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {registerEvents} from './command.events';

var CommandSchema = new mongoose.Schema({
  reader: {type: Schema.Types.ObjectId, ref: 'Reader'},
  room: {type: Schema.Types.ObjectId, ref: 'Room'},
  command: String,
  date: {type: Date},
  status: Boolean
});

registerEvents(CommandSchema);
export default mongoose.model('Command', CommandSchema);
