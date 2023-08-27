const mongoose = require('mongoose');

const schema = mongoose.Schema;

const taskSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
 
  date: {
    type: Date,
    default: Date.now
  }

});
module.exports = mongoose.model('task', taskSchema);
