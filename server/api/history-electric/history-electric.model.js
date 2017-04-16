'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {registerEvents} from './history-electric.events';

var HistoryElectricSchema = new mongoose.Schema({
  room: {type: Schema.Types.ObjectId, ref: 'Room'},
  dateElectric: {type: Date},
  unitElectric: {
        type: Number,
        required: true
                },
  imageElectric: String,
});

registerEvents(HistoryElectricSchema);
export default mongoose.model('HistoryElectric', HistoryElectricSchema);