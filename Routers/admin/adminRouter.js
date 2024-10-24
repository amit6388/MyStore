
const express = require("express");
const Router = express.Router();
const {
  createProduct,
  putProduct,
   getProduct, 
  deleteProduct, 
  getSingleProduct ,
  loginInstrucor, 
  putInstructor,
  createInstructor,
  getInstructor,
  deleteInstructor,
  getSingleInstructor
 } = require('../../controllers/admin/AdminController');
 const {
  createOrder,
  putOrder,
  deleteOder,
  getOrders,
  getOrderByUserId,
  updateOrderStatus
 }=require('../../controllers/admin/oderController')
const img_upload = require('../../multer/admin/fileupload') ;
const { requireSignIn } = require('../../middlewares/authMiddleware'); 
//admin Route for mange the application
Router.route('/admin-login').post(loginInstrucor);
Router.route('/admin').post(createInstructor);
Router.route('/admin').get(getInstructor);
Router.route('/admin/:_id').delete(deleteInstructor);
Router.route('/admin/:_id').put(putInstructor);
Router.route('/admin/:_id').get(getSingleInstructor);
//product
Router.post('/add-product',   createProduct); 
Router.put('/add-product/:_id', putProduct); 
Router.delete('/add-product/:_id', deleteProduct); 
Router.get('/add-product/:_id',  getSingleProduct); 
Router.get('/add-product', getProduct);
//order status
Router.post('/order',   createOrder); 
Router.put('/order/:_id', putOrder); //spectific id 
Router.delete('/order/:_id', deleteOder); 
Router.get('/order/:userId',  getOrderByUserId); //single user by id
Router.get('/order', getOrders);
Router.put('/update-status/:orderId',updateOrderStatus)


module.exports = Router; 