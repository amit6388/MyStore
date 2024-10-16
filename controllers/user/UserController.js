const userTable=require('../../models/user/index') ;
const ContentSchema=require('../../models/admin/Product') ;
 const jwt=require('jsonwebtoken');
const loginUser=async(req,res,next)=>{
  try { 
    const email = req.body.email;
    const password = req.body.password;
    const query = {
      password: password,
      ...(isNaN(email) ? { email: email } : { contact: Number(email) })  
    }; 
    const usermail = await userTable.findOne(query); 
    if (usermail) {
      let token=await jwt.sign({username:usermail.email},process.env.JWT_SECRET,{expiresIn:'1h'})
      res.json({
        code: 200,
        message: "user Login successfully",
        data: {
          _id: usermail._id,
          name: usermail.name,
          email: usermail.email,
          contact:usermail.contact,
          token: token,
        },
        error: false,
        status: true,
      });
      console.log(usermail._id);
    } else {
      res.json({
        code: 404,
        message: "Invalid email, contact, or password. Please try again.",
        data: [],
        error: false,
        status: false,
      });
    }
    } catch (err) {
      console.log(err);
      return res.json({
        code: 500,
        message: "An internal server error occurred.",
        error: true,
        status: false,
        data: [],
      });
    }
} 
const createUser = async (req, res) => {
  try {
    const { name, email, contact, password } = req.body;

    // Basic validation for missing fields
    if (!name || !email || !contact || !password) {
      return res.json({
        code: 400,
        message: "Missing required fields: name, email, contact, or password.",
        error: true,
        status: false,
        data: [],
      });
    }

    // Check if the user with the provided email already exists
    const usermail = await userTable.findOne({
      $or: [
        { email: email },
        { contact: contact }  // Replace 'contact' with the actual field name for contact number
      ]
    });
    
    if (usermail) {
      return res.json({
        code: 409,
        message: "User already exists with this email or contact",
        error: true,
        status: false,
        data: [],
      });
    }

    // Create a new instructor
    let data = new userTable({ name, email, contact, password });
    await data.save();

    // Success response
    return res.json({
      code: 201,
      message: "User registered successfully.",
      error: false,
      status: true,
      data: data, // You may include the user data if necessary
    });

  } catch (err) {
    console.error(err);

    // Handle unexpected errors
    return res.json({
      code: 500,
      message: "An internal server error occurred.",
      error: true,
      status: false,
      data: [],
    });
  }
};

const putUser = async (req, res) => {
  try {
    const { name, email, contact, password } = req.body;

    let data = await userTable.updateOne(
      { _id: req.params._id },
      { $set: { name, email, contact, password } }
    );

    if (data.modifiedCount > 0) {
      res.json({
        code: 200,
        message: "User details updated successfully.",
        data: {
          _id: req.params._id,
          name,
          email,
          contact,
        },
        error: false,
        status: true,
      });
    } else {
      res.json({
        code: 404,
        message: "User not found or no changes made.",
        data: [],
        error: true,
        status: false,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      code: 500,
      message: "An internal server error occurred.",
      error: true,
      status: false,
      data: [],
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    let data = await userTable.deleteOne({ _id: req.params._id });

    if (data.deletedCount > 0) {
      res.json({
        code: 200,
        message: "User deleted successfully.",
        data: {
          _id: req.params._id,
        },
        error: false,
        status: true,
      });
    } else {
      res.json({
        code: 404,
        message: "User not found.",
        data: [],
        error: true,
        status: false,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      code: 500,
      message: "An internal server error occurred.",
      error: true,
      status: false,
      data: [],
    });
  }
};

const getUser = async (req, res) => {
  try {
    let data = await userTable.find();

    if (data.length > 0) {
      res.json({
        code: 200,
        message: "Users retrieved successfully.",
        data: data,
        error: false,
        status: true,
      });
    } else {
      res.json({
        code: 404,
        message: "No users found.",
        data: [],
        error: true,
        status: false,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      code: 500,
      message: "An internal server error occurred.",
      error: true,
      status: false,
      data: [],
    });
  }
};

const getSingleUser = async (req, res) => {
  try {
    let data = await userTable.findOne({ _id: req.params._id });

    if (data) {
      res.json({
        code: 200,
        message: "User retrieved successfully.",
        data: data,
        error: false,
        status: true,
      });
    } else {
      res.json({
        code: 404,
        message: "User not found.",
        data: [],
        error: true,
        status: false,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      code: 500,
      message: "An internal server error occurred.",
      error: true,
      status: false,
      data: [],
    });
  }
};


  

module.exports={  
  // user...
    loginUser,
  createUser,
  putUser,
   getUser, 
  deleteUser, 
  getSingleUser 
   
}