'use strict';

import mongoose from 'mongoose';
import { registerEvents } from './history-water.events';

var HistoryWaterSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  dateWater: { type: Date, default: Date.now },
  unitWater: {
    type: Number,
    required: true
  },
  image: {
    data: Buffer,
    contentType: String
  }
});

registerEvents(HistoryWaterSchema);
export default mongoose.model('HistoryWater', HistoryWaterSchema);