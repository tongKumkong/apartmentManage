'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './reader.events';

var ReaderSchema = new mongoose.Schema({
  barcode: String,
  statue: Boolean,
  readingArea: String,
  tmpImage: String
});

registerEvents(ReaderSchema);
export default mongoose.model('Reader', ReaderSchema);
