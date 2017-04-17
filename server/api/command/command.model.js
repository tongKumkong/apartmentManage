'use strict';

import mongoose from 'mongoose';
import { registerEvents } from './command.events';

var CommandSchema = new mongoose.Schema({
  reader: { type: mongoose.Schema.Types.ObjectId, ref: 'Reader' },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  command: String,
  date: { type: Date, default: Date.now  },
  status: Boolean
});

registerEvents(CommandSchema);
export default mongoose.model('Command', CommandSchema);
