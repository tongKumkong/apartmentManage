'use strict';

import mongoose from 'mongoose';
import { registerEvents } from './history-electric.events';

var HistoryElectricSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  dateElectric: { type: Date },
  unitElectric: {
    type: Number,
    required: true
  },
  image: {
    data: Buffer,
    contentType: String
  }
});

registerEvents(HistoryElectricSchema);
export default mongoose.model('HistoryElectric', HistoryElectricSchema);