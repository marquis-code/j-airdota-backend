const mongoose = require("mongoose");

let memberPurchaseSchema = new mongoose.Schema(
    {
        purchaseItem: {
            type: String,
        },
        memberRegion: {
            type: String,
        },
        journalPurchased: {
            type: String,
        },
        user: {
            type: String,
            required: [true, "please enter user email"],
          },
        price: {
            type: String,
            default : '0.00'
        }
    },
    {
        timestamps: true,
    }
);

memberPurchaseSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

memberPurchaseSchema.set("toJSON", {
    virtuals: true,
});

const memberPurchase = mongoose.model("memberPurchase", memberPurchaseSchema);

module.exports = memberPurchase;
