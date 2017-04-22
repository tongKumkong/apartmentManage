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
  command: {
    name: String,
    status: Number,
    date: {type:Date, default: Date.now }
  },
  image: {
    data: String,
    width: Number,
    height: Number,
    contentType: String,
    time: {type:Date, default: Date.now }
  },
  readingArea: {
    x: Number,
    y: Number,
    w: Number,
    h: Number
  }
});

registerEvents(ReaderSchema);
export default mongoose.model('Reader', ReaderSchema);
