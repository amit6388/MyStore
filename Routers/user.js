
const express = require("express");
const userRouter = express.Router();
const {
  loginUser,
  createUser,
  putUser,
   getUser, 
  deleteUser, 
  getSingleUser 
 } = require('../controllers/user/UserController');
const img_upload = require('../multer/admin/fileupload') ;
const { requireSignIn } = require('../middlewares/authMiddleware'); 
userRouter.route('/user-login').post(loginUser);
 userRouter.route('/user').post(createUser);
userRouter.route('/user').get(getUser);
userRouter.route('/user/:_id').delete(deleteUser);
userRouter.route('/user/:_id').put(putUser);
userRouter.route('/user/:_id').get(getSingleUser);
 
module.exports = userRouter; 