const InstructorRegisterSchema=require('../../models/admin/InstructorModel') ;
const ProductTable=require('../../models/admin/Product') ;
const uploadFile=require('../../middlewares/uploads')
 const jwt=require('jsonwebtoken');
const loginInstrucor=async(req,res,next)=>{
  try { 
    const email = req.body.email;
    const password = req.body.password;
    const query = {
      password: password,
      ...(isNaN(email) ? { email: email } : { contact: Number(email) })  
    }; 
    const usermail = await InstructorRegisterSchema.findOne(query); 
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
const createInstructor = async (req, res) => {
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
    const usermail = await InstructorRegisterSchema.findOne({
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
    let data = new InstructorRegisterSchema({ name, email, contact, password });
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

const putInstructor=async(req,res)=>{
try {

  const { name,email,contact,password}=req.body
    

   let data = await InstructorRegisterSchema.updateOne(
   {_id: req.params._id},
    { $set:  { name,email,contact,password}}

);
     res.send(data);

 } catch (err) {
     console.log(err)
 }

}

const getInstructor=async(req,res)=>{

  let data = await InstructorRegisterSchema.find( );

  res.send(data);
}
const getSingleInstructor=async(req,res)=>{

  let data = await InstructorRegisterSchema.find({_id:req.params._id} );

  res.send(data);
}
const deleteInstructor= async (req, res) => {
try {
  //console.log(req.params.contact);
  let data = await InstructorRegisterSchema.deleteOne({_id:req.params._id});
  res.send(data);
} catch (err) {
  console.log(err);
}
} 
 
//PRODCT 
const createProduct = async (req, res) => {
  try {
      const { name, price, dose, discount, outofstock, pills } = req.body;
      const img = req.files?.img;
  
      if (!name || !price || !dose  ) {
          return res.status(400).json({
              code: 400,
              message: "Missing required fields: name, price, dose, or img.",
              error: true,
              status: false,
              data: [],
          });
      }

      // Check if a product with the same name already exists
      const existingProduct = await ProductTable.findOne({ name });
      if (existingProduct) {
          return res.status(409).json({
              code: 409,
              message: "Product already exists with this name.",
              error: true,
              status: false,
              data: [],
          });
      }

      // Call the uploadFile function
      const uploadedFileName = await uploadFile(img); // Upload file and get the filename

      // Create a new product
      let data = new ProductTable({
          name,
          price,
          dose,
          discount,
          outofstock,
          pills,
          img: uploadedFileName // Save the file name in your database
      });
      await data.save();

      // Success response
      return res.status(201).json({
          code: 201,
          message: "Product created successfully.",
          error: false,
          status: true,
          data: data, // You may include the product data if necessary
      });

  } catch (err) {
      console.error(err);
      return res.status(500).json({
          code: 500,
          message: "An internal server error occurred.",
          error: true,
          status: false,
          data: [],
      });
  }
};

const putProduct = async (req, res) => {
  try {
      const { name, price, dose, discount, outofstock, pills } = req.body;
      const img = req.files?.img; // Access the uploaded file using req.files

      // Ensure img is required for updating product, but allow for updates without img
      if (!img) {
          return res.status(400).json({
              code: 400,
              message: "Missing required field: img.",
              error: true,
              status: false,
              data: [],
          });
      }

      // Call the uploadFile function
      const uploadedFileName = await uploadFile(img); // Upload file and get the filename

      // Update product details
      let data = await ProductTable.updateOne(
          { _id: req.params._id },
          { $set: { name, price, dose, discount, outofstock, pills, img: uploadedFileName } }
      );

      if (data.modifiedCount > 0) {
          res.status(200).json({
              code: 200,
              message: "Product details updated successfully.",
              data: {
                  _id: req.params._id,
                  name,
                  price,
                  dose,
                  discount,
                  outofstock,
                  pills,
                  img: uploadedFileName, // Return the sanitized file name
              },
              error: false,
              status: true,
          });
      } else {
          res.status(404).json({
              code: 404,
              message: "Product not found or no changes made.",
              data: [],
              error: true,
              status: false,
          });
      }
  } catch (err) {
      console.log(err);
      return res.status(500).json({
          code: 500,
          message: "An internal server error occurred.",
          error: true,
          status: false,
          data: [],
      });
  }
};

const deleteProduct = async (req, res) => {
  try {
    let data = await ProductTable.deleteOne({ _id: req.params._id });

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
const getProduct = async (req, res) => {
  try {
    let data = await ProductTable.find();

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
        message: "No data  found.",
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
const getSingleProduct  = async (req, res) => {
  try {
    let data = await ProductTable.findOne({ _id: req.params._id });

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
  // admin...
    loginInstrucor,
  createInstructor,
  putInstructor,
   getInstructor, 
  deleteInstructor, 
  getSingleInstructor ,
  // product...  
  createProduct,
  putProduct,
   getProduct, 
  deleteProduct, 
  getSingleProduct  
}