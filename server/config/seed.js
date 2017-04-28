/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import config from './environment/';
import Building from '../api/building/building.model';
import Command from '../api/command/command.model';
import HistoryWater from '../api/history-water/history-water.model';
import HistoryElectric from '../api/history-electric/history-electric.model';
import Room from '../api/room/room.model';
import Reader from '../api/reader/reader.model';

var async = require("async");
var fs = require('fs');
var imgPath = './server/config/testImg.jpg';

var testImg = {
  data: fs.readFileSync(imgPath,{encoding:"base64"}),
  contentType: 'image/jpg',
  width: 320,
  height: 240
}

export default function seedDatabaseIfNeeded() {
  if (config.seedDB) {
    async.waterfall([
      function (callback) {
        Thing.find({}).remove()
          .then(() => {
            Thing.create({
              name: 'Development Tools',
              info: 'Integration with popular tools such as Webpack, Gulp, Babel, TypeScript, Karma, '
              + 'Mocha, ESLint, Node Inspector, Livereload, Protractor, Pug, '
              + 'Stylus, Sass, and Less.'
            }, {
                name: 'Deployment Ready',
                info: 'Easily deploy your app to Heroku or Openshift with the heroku '
                + 'and openshift subgenerators'
              });
          })
          .then(() => {
            console.log('finished populating things');
            callback(null);
          }
          )
          .catch(err => console.log('error populating things', err));
      },
      function (callback) {
        User.find({}).remove()
          .then(() => {
            User.create(
              {
                provider: 'local',
                role: 'admin',
                name: 'Admin',
                email: 'admin@example.com',
                password: 'admin'
              },
              {
                provider: 'local',
                name: 'Test User',
                email: 'test@example.com',
                password: 'test'
              }
            )
              .then(() => {
                User.findOne({ email: 'test@example.com' }, '+_id')
                  .then((user) => {
                    callback(null, user._id);
                    console.log('finished populating users')
                  })
              })
              .catch(err => console.log('error populating users', err));
          })
      },

      function (userId, callback) {
        Building.find({}).remove()
          .then(() => {
            Building.create({
              name: 'Building A',
              owner: userId
            })
              .then(() => {
                Building.findOne({ name: 'Building A' }, '+_id')
                  .then(building => {
                    console.log('finish populate building A\n');
                    callback(null, userId, building._id);
                  })
              })
          })
      },
      function ( userId, buildingId, callback) {
        Reader.find({}).remove()
          .then(() => {
            Reader.create({
              barcode: '0013A200408D1BC1',
              status: true,
              command: {name:'TAPI',status:0},
              image: testImg,
              readingArea: {
                x: 146,
                y: 102,
                w: 104,
                h: 37
              }
            })
              .then(() => {
                Reader.findOne({ barcode: '0013A200408D1BC1' }, '+_id').then(reader => {
                  console.log('finish populate barcode\n');
                  callback(null, userId, buildingId, reader._id);
                })
              })
          })
      },
      function (userId, buildingId, readerId, callback) {
        Room.find({}).remove()
          .then(() => {
            Room.create({
              name: '201',
              building: buildingId,
              waterReader: readerId,
              status : 0
            })
              .then(() => {
                Room.findOne({ name: '201' }, '+_id').then(room => {
                  console.log('finish populate room 201\n');
                  callback(null, userId, buildingId,readerId, room._id);
                })
              })
          })
      },
      function (userId, buildingId, readerId, roomId, callback) {
        Command.find({}).remove()
          .then(() => {
            Command.create({
              reader: readerId,
              room: roomId,
              command: '',
              date: '2017-03-30T09:00:00',
              status: true
            })
              .then(() => {
                callback(null, userId, buildingId, readerId, roomId);
              })
          })
      },
      function (userId, buildingId,readerId, roomId, callback) {
        HistoryElectric.find({}).remove()
          .then(() => {
              HistoryElectric.create({
              room: roomId,
              date: new Date('2016-12-27T23:58:00'),
              unit: '154'
            },
            {
              room: roomId,
              date: new Date('2017-01-30T23:55:00'),
              unit: '332'
            },
            {
              room: roomId,
              date: new Date('Wed Mar 01 2017 00:00:00 GMT+0700 (SE Asia Standard Time)'),
              unit: '456'
            },
            {
              room: roomId,
              date: new Date('Wed Mar 31 2017 00:00:00 GMT+0700 (SE Asia Standard Time)'),
              unit: '651'
            }
            )
              .then(() => {
                callback(null, userId, buildingId, readerId, roomId );
              })
          })
      },

      function (userId, buildingId,readerId, roomId, callback) {
        HistoryWater.find({}).remove()
          .then(() => {
              HistoryWater.create({
              room: roomId,
              date: new Date('2016-12-27T23:58:00'),
              unit: '12',
            },
            {
              room: roomId,
              date: new Date('2017-01-30T23:55:00'),
              unit: '21',
            },
            {
              room: roomId,
              date: new Date('Wed Mar 01 2017 00:00:00 GMT+0700 (SE Asia Standard Time)'),
              unit: '30',
            },
            {
              room: roomId,
              date: new Date('Wed Mar 31 2017 00:00:00 GMT+0700 (SE Asia Standard Time)'),
              unit: '36',
            }
            )
              .then(() => {
                callback(null, userId, buildingId,readerId, roomId );
              })
          })
      }
    ]);
  }
}