'use strict';

import mongoose from 'mongoose';
import { registerEvents } from './history-water.events';

var HistoryWaterSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  date: { type: Date, default: Date.now },
  unit: Number,
  image: {
    data: Buffer,
    contentType: String
  }
});

registerEvents(HistoryWaterSchema);
export default mongoose.model('HistoryWater', HistoryWaterSchema);