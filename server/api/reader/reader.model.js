'use strict';

import mongoose from 'mongoose';
import { registerEvents } from './reader.events';

var ReaderSchema = new mongoose.Schema({
  barcode: {
    type: String,
    required: true,
    uppercase: true
  },
  statue: Boolean,
  readingArea: String,
  command: {
    name: String,
    status: Number,
    date: {type:Date, default: Date.now }
  },
  image: {
    data: String,
    contentType: String,
    time: {type:Date, default: Date.now }
  }
});

registerEvents(ReaderSchema);
export default mongoose.model('Reader', ReaderSchema);
