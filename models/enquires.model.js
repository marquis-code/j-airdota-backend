const mongoose = require("mongoose");

let enquirySchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Regex for email validation
      },
      phone: {
        type: String,
        required: false
      },
      interest: {
        type: String,
        enum: ['academy', 'journal'],
        required: true
      },
      message: {
        type: String,
        required: true,
        maxlength: 500 // Optional: limit message length
      }
  },
  {
    timestamps: true,
  }
);

enquirySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

enquirySchema.set("toJSON", {
  virtuals: true,
});

const Enquiry = mongoose.model("enquiry", enquirySchema);

module.exports = Enquiry;