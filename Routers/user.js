
const express = require("express");
const userRouter = express.Router();
const {
  loginUser,
  createUser,
  putUser,
   getUser, 
  deleteUser, 
  getSingleUser ,
//Cart  
  createCart,
  putCart,
   getCart, 
  deleteCart, 
  getSingleCart, 
 } = require('../controllers/user/UserController');
 const {getOrderByUserId} =require('../controllers/admin/oderController')
const img_upload = require('../multer/admin/fileupload') ;
const { requireSignIn } = require('../middlewares/authMiddleware'); //middleware for authentication 
///userCreate
userRouter.route('/user-login').post(loginUser);
 userRouter.route('/user').post(createUser);
userRouter.route('/user').get(getUser);
userRouter.route('/user/:_id').delete(deleteUser);
userRouter.route('/user/:_id').put(putUser);
userRouter.route('/user/:_id').get(getSingleUser);
 //createCart
 userRouter.route('/add-to-cart').post(createCart);
 userRouter.route('/add-to-cart').get(getCart);
 userRouter.route('/add-to-cart/:_id').delete(deleteCart);
 userRouter.route('/add-to-cart/:_id').put(putCart);
 userRouter.route('/add-to-cart/:_id').get(getSingleCart);
//order Route
userRouter.route('/order').post(createCart);
userRouter.route('/order/:userId').post(getOrderByUserId);

module.exports = userRouter; 