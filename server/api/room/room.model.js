'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {registerEvents} from './room.events';

var RoomSchema = new mongoose.Schema({
  name: {
        type: String,
        required: true
        },
  building: {type: Schema.Types.ObjectId, ref: 'Building',
        required: true},
  electricReader: {type: Schema.Types.ObjectId, ref: 'Reader'},
  waterReader: {type: Schema.Types.ObjectId, ref: 'Reader'}
});

registerEvents(RoomSchema);
export default mongoose.model('Room', RoomSchema);
