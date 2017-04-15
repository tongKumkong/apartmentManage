'use strict';

import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {registerEvents} from './building.events';

var BuildingSchema = new mongoose.Schema({
  name: String,
  owner: {type: Schema.Types.ObjectId, ref: 'User'}
});

registerEvents(BuildingSchema);
export default mongoose.model('Building', BuildingSchema);
