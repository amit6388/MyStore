
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
const img_upload = require('../../multer/admin/fileupload') ;
const { requireSignIn } = require('../../middlewares/authMiddleware'); 

Router.route('/admin-login').post(loginInstrucor);
Router.route('/admin').post(createInstructor);
Router.route('/admin').get(getInstructor);
Router.route('/admin/:_id').delete(deleteInstructor);
Router.route('/admin/:_id').put(putInstructor);
Router.route('/admin/:_id').get(getSingleInstructor);

Router.post('/add-product',   createProduct); 
Router.put('/add-product/:_id', putProduct); 
Router.delete('/add-product/:_id', deleteProduct); 
Router.get('/add-product/:_id',  getSingleProduct); 
Router.get('/add-product', getProduct);

module.exports = Router; 