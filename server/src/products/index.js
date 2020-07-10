const express = require("express");
const _ = require("lodash");
const productModel = require("../functions/productModel");
const reviewModel = require("../functions/reviewModel");
const router = express.Router();
const q2m = require("query-to-mongo");
const Cart = require('../functions/cart');
const shopController = require('../functions/shop');

router
  .route("/")
  .get(async (req, resp, next) => {
    /* try {
        const query = q2m(req.query)
        const users = await productModel.find(query.criteria, query.options.fields)
          .skip(query.options.skip)
          .limit(query.options.limit)
          .sort(query.options.sort)
    
        res.send({
          data: users,
          total: users.length,
        })
      } catch (error) {
        next(error)
      }
    }) */

    try {
      const { query } = req;
      const page = query.page;
      delete query.page;
      const queryToMongo = q2m(query);
      const criteria = queryToMongo.criteria;
      for (let key in criteria) {
        criteria[key] = { $regex: `${criteria[key]}`, $options: "i" };
      }
      console.log(criteria);
      const products = await productModel.find(criteria)
        .populate('Review')
        .skip(10 * page)
        .limit(10);
      const numOfproducts = await productModel.count(criteria);
      resp.send({
        data: products,
        currentPage: page,
        pages: Math.ceil(numOfproducts / 10),
        results: numOfproducts,
      });
    } catch (e) {
      e.httpRequestStatusCode = 404;
      next(e);
    }
  })
  .post(async (req, res, next) => {
    try {
      const newproduct = await productModel(req.body);
      const { _id } = await newproduct.save();
      res.send(_id);
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  });
router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const product = await productModel.findById(req.params.id);
      res.send(product);
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  })
  .put(async (req, res, next) => {
    try {
      const { _id } = await productModel.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      res.send(_id);
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const result = await productModel.findByIdAndDelete(req.params.id);
      res.send(result);
    } catch (e) {
      e.httpRequestStatusCode = 500;
      next(e);
    }
  });
router.route("/:id/reviews").get(async (req, res, next) => {
    try {
        const query = q2m(req.query)
        const review = await reviewModel.find(query.criteria, query.options.fields)
        .skip(query.options.skip)
          .limit(query.options.limit)
          .sort(query.options.sort)
        if (review) {
    
          res.send({
            totalNumberOfreviews: review.length,
            reviews:review})
        } else {
          const error = new Error()
          error.httpStatusCode = 404
          next(error)
        }
      } catch (error) {
        console.log(error)
        next("While reading review list a problem occurred!")
      }
});

router.route("/:id/reviews").post(async (req, res, next) => {
    try {
      const newreview = new reviewModel(req.body)
      const { _id } = await newreview.save()
      console.log(newreview)
      res.status(201).send(_id)
    } catch (error) {
      next(error)
    }
  })

router.post('/add-to-cart', shopController.addToCart);

router.get('/cart', shopController.getCart);

router.post('/delete-cart', shopController.deleteInCart);

  

  /* router.route("/add-to-cart").get(async (req, res, next) => {
    try {
      const productId  = req.params.id
      const cart = new Cart(req.session.cart ? req.session.cart.items : {});
      productModel.findById(productId, function (err, product) {
        cart.add(product, product.id);
        req.session.cart = cart;
       
    });
      res.status(201).send('OK')
    } catch (error) {
      next(error)
    }
  })

  router.route("/shopping-cart").get(async (req, res, next) => {
    try {
        if (!req.session.cart) {
            return res.render('shop/shopping-cart', {products: null});
        }
        var cart = new Cart(req.session.cart.items);
        res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
    
     
    } catch (error) {
      next(error)
    }
  }) */



module.exports = router;