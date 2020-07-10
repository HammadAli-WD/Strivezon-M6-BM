const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const v = require("validator");
const ReviewSchema = new Schema({
comment: {
    type: String,
    required: true,
  },  
rate: {
    type: Number,
    required: true,
  },
/* createdAt: {
    type: Date,
    required: true,
  }, */
  productID: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

ReviewSchema.static("findReviewWithProducts", async function (id) {
  let Reviews = await ReviewModel.findOne({ productID: id }.populate("Product"));

  return Reviews;
});

/* ReviewSchema.static("findAllReviewsByproductId", async function (id) {
  let Reviews = await ReviewModel.find({ productID: id });

  return Reviews;
}); */
const ReviewModel = mongoose.model("Review", ReviewSchema);

module.exports = ReviewModel;