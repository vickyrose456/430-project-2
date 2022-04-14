const mongoose = require('mongoose');

let FileModel = {};

const FileSchema = new mongoose.Schema({
  // The name will include the file extension.
  name: {
    type: String,
  },
  data: {
    type: Buffer,
  },
  size: {
    type: Number,
  },
  mimetype: {
    type: String,
  },
});

// Finally we construct a model based on our schema above.
FileModel = mongoose.model('FileModel', FileSchema);

module.exports = FileModel;
