const mongoose = require("mongoose");

let eventsSchema = new mongoose.Schema(
  {
    programTitle: {
      type: String,
      required: [true, "please enter event title"],
    },
    programDescription: {
      type: String,
      required: [true, "please enter event description"],
    },
    programDate: { type: Date, default: Date.now },

    programImageUrl: {
      type: String,
      required: [true, "please upload event image"],
    },
    cloudinary_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

eventsSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

eventsSchema.set("toJSON", {
  virtuals: true,
});

const Events = mongoose.model("event", eventsSchema);

module.exports = Events;