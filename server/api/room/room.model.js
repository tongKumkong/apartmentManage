'use strict';

import mongoose from 'mongoose';
import { registerEvents } from './room.events';

var RoomSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true
      },
      building: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Building',
            required: true
      },
      electricReader: { type: mongoose.Schema.Types.ObjectId, ref: 'Reader' },
      waterReader: { type: mongoose.Schema.Types.ObjectId, ref: 'Reader' },
      status: {
            type: Number,
            required: true
      }
});

registerEvents(RoomSchema);
export default mongoose.model('Room', RoomSchema);
