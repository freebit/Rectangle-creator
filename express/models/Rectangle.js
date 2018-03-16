const mongoose = require('mongoose');

let RectangleSchema = new mongoose.Schema({
  positionX: {type: String, default: "0"},
  positionY: {type: String, default: "0"},
  width: {type: String, default: "0"},
  height: {type: String, default: "0"},
  backgroundColor: String
});


module.exports = mongoose.model('Rectangle', RectangleSchema);