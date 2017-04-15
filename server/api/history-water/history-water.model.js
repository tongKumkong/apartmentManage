'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {registerEvents} from './history-water.events';

var HistoryWaterSchema = new mongoose.Schema({
  room: {type: Schema.Types.ObjectId, ref: 'Room'},
  dateWater: {type: Date},
  unitWater: Number,
  imageWater: String
});

registerEvents(HistoryWaterSchema);
export default mongoose.model('HistoryWater', HistoryWaterSchema);