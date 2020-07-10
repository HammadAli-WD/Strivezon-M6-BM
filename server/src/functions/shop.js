
const product = require("./productModel")


exports.addToCart = (req, res, next) => {
    req.product.addToCart(req.body.id)
        .then(() => {
            res.redirect('/cart');
        }).catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
    req.product
        .populate('cart.items.productId')
        .execPopulate()
        .then(product => {
            console.log(product);           
        })
        .catch(err => console.log(err));
}

exports.deleteInCart = (req, res, next) => {
    req.product.removeFromCart(req.body.prodId)
        .then(() => {
            res.redirect('/cart');
        }).catch(err => console.log(err));

}