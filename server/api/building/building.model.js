'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {registerEvents} from './building.events';

var BuildingSchema = new mongoose.Schema({
  name: {
        type: String,
        required: true
        },
  owner: {type: Schema.Types.ObjectId, ref: 'User',
        required: true }
});

registerEvents(BuildingSchema);
export default mongoose.model('Building', BuildingSchema);
