'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {registerEvents} from './room.events';

var RoomSchema = new mongoose.Schema({
  name: String,
  building: {type: Schema.Types.ObjectId, ref: 'Building'},
  electricReader: {type: Schema.Types.ObjectId, ref: 'Reader'},
  waterReader: {type: Schema.Types.ObjectId, ref: 'Reader'}
});

registerEvents(RoomSchema);
export default mongoose.model('Room', RoomSchema);
