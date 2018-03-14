const mongoose = require('mongoose');

let RectangleSchema = new mongoose.Schema({
  positionX: {type: String, default: "0px"},
  positionY: {type: String, default: "0px"},
  width: {type: String, default: "100px"},
  height: {type: String, default: "100px"},
  backgroundColor: String
});


module.exports = mongoose.model('Rectangle', RectangleSchema);