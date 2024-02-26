const mongoose = require('mongoose');

const publicationSchema = mongoose.Schema({
  publicationTitle: {
    type: String,
    required: '{PATH} is required!'
  },
  publicationSubTitle: {
    type: String
  },
  author: {
    type: [String],
  },
  publicationPrice : {
    type: String
  },
  available: {
    type: String
  },
  publicationUrl: {
    type: String
  },
  publicationType: {
    type: String,
    emum: ["papers", "Conference presentation", 'Teaching document', 'articles'],
    default: "papers",
  },
  language: {
    type: String
  },
  cloudinary_id: {
    type: String,
  },
  published_date: { type: Date, default: Date.now },
}, {
  timestamps: true
});
const Publication = mongoose.model("Publication", publicationSchema);

module.exports = Publication;