const mongoose = require("mongoose");

let newsRoomSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        subTitle: {
            type: String,
        },
        content: {
            type: String,
        },
        noteFromPublisher: {
            type: String,
        },
        date: {
            type: String,
        },
        newsRoomType: {
            type: String,
            enum: ["Advocacy", "Member Notes", "In Memoriam"],
        }
    },
    {
        timestamps: true,
    }
);

newsRoomSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

newsRoomSchema.set("toJSON", {
    virtuals: true,
});

const NewsRoom = mongoose.model("newsRoom", newsRoomSchema);

module.exports = NewsRoom;
