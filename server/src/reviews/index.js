const express = require("express");
const router = express.Router();
const {reviewModel} = require("../functions/reviewModel");

router
  .route("/")
  .get(async (request, response, next) => {
    try {
        const review = await reviewModel.find(req.query).populate("Product")
        res.send(review)
    } catch (e) {
      e.httpRequestStatusCode = 404;
      next(e);
    }
  })
  .post(async (request, response, next) => {
    try {
      const newreview = await new reviewModel(request.body);
      const { _id } = await newreview.save();
      response.status(200).send(_id);
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  });

router
  .route("/:id")
  .get(async (request, response, next) => {
    try {
      const product = await reviewModel.findBookWithAuthors(id);
      response.status(200).send(product);
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  })
  .put(async (request, response, next) => {
    try {
      const { _id } = await reviewModel.findByIdAndUpdate(
        request.params.id,
        request.body
      );
      response.status(200).send(_id);
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  })
  .delete(async (request, response, next) => {
    try {
      const result = await reviewModel.findByIdAndDelete(request.params.id);
      response.status(200).send(result);
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  });

module.exports = router;