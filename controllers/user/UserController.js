const userTable=require('../../models/user/index') ;
const ProductTable=require('../../models/admin/Product') ;
const addToCartTable=require('../../models/user/Cart')
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

///Add TO Cart 
const createCart = async (req, res) => {
  try {
    const { productId, userId } = req.body;

    console.log("Received productId:", productId);
    console.log("Received userId:", userId);

    // Basic validation for missing fields
    if (!productId || !userId) {
      return res.json({
        code: 400,
        message: "Missing required fields: productId or userId.",
        error: true,
        status: false,
        data: [],
      });
    }

    // Check if the cart already exists for the given userId and productId
    const existingCart = await addToCartTable.findOne({ userId, productId });

    if (existingCart) {
      // If the entry already exists, send a conflict response
      return res.json({
        code: 409,
        message: "Product is  already exists in your cart.",
        error: true,
        status: false,
        data: [],
      });
    } else {
      // If no duplicate is found, create a new cart entry
      const newCart = new addToCartTable({ productId, userId });

      await newCart.save(); // Save the new cart entry
      console.log("Cart saved successfully");

      // Success response
      return res.json({
        code: 201,
        message: "Cart created successfully.",
        error: false,
        status: true,
        data: newCart, // Include the cart data if necessary
      });
    }
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




const putCart = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    const cartId = req.params._id; // Store the cart ID from params

    // First, check if the cart entry exists
    const existingCart = await addToCartTable.findById(cartId);

    if (!existingCart) {
      return res.json({
        code: 404,
        message: "Cart not found for the given ID.",
        data: [],
        error: true,
        status: false,
      });
    }

    // If the cart entry exists, update it
    const updatedCart = await addToCartTable.findByIdAndUpdate(
      cartId, // Find the cart entry by ID
      { $set: { productId, userId } }, // Update with the entire body (make sure only valid fields are allowed)
      { new: true } // Return the updated document
    );

    return res.json({
      code: 200,
      message: "Cart updated successfully.",
      data: updatedCart,
      error: false,
      status: true,
    });
  } catch (err) {
    console.error(err);
    return res.json({
      code: 500,
      message: "An internal server error occurred.",
      error: true,
      status: false,
      data: [],
    });
  }
};




const deleteCart = async (req, res) => {
  try {
    let data = await addToCartTable.deleteOne({ _id: req.params._id });

    if (data.deletedCount > 0) {
      res.json({
        code: 200,
        message: "Cart Data deleted successfully.",
        data: {
          _id: req.params._id,
        },
        error: false,
        status: true,
      });
    } else {
      res.json({
        code: 404,
        message: "Cart Data not found.",
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

const getCart = async (req, res) => {
  try {
    const data = await addToCartTable.find();

    if (data.length > 0) {
      // Use Promise.all to fetch user and product details
      const cartWithDetails = await Promise.all(
        data.map(async (cartItem) => {
          const userDetail = await userTable.findById(cartItem.userId);
          const productDetail = await ProductTable.findById(cartItem.productId);
          
          return {
            ...cartItem.toObject(), // Convert mongoose document to plain object
            userDetail,
            productDetail,
          };
        })
      );

      return res.json({
        code: 200,
        message: "Cart Data retrieved successfully.",
        data: cartWithDetails,
        error: false,
        status: true,
      });
    } else {
      return res.json({
        code: 404,
        message: "No Cart Data found.",
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


const getSingleCart = async (req, res) => {
  try {
    // Find all cart items for the user based on userId from the request params
    const data = await addToCartTable.find({ userId: req.params._id });

    if (data.length > 0) {
      // Use Promise.all to fetch user and product details for each cart item
      const cartWithDetails = await Promise.all(
        data.map(async (cartItem) => {
          const userDetail = await userTable.findById(cartItem.userId);
          const productDetail = await ProductTable.findById({_id: cartItem?.productId});

          // Only include the cart item if both userDetail and productDetail are found
          if (userDetail && productDetail) {
            return {
              ...cartItem._doc, // Use `_doc` to access the plain document object
              userDetail,
              productDetail,
            };
          } else {
            return null; // Exclude cart items where productDetail is missing
          }
        })
      );

      // Filter out any null values (cart items without matching productDetail)
      const validCartItems = cartWithDetails.filter(item => item !== null);

      if (validCartItems.length > 0) {
        // Return the combined cart data with user and product details
        return res.json({
          code: 200,
          message: "Cart data retrieved successfully.",
          data: validCartItems,
          error: false,
          status: true,
        });
      } else {
        // No valid cart data found
        return res.json({
          code: 404,
          message: "No valid cart data found.",
          data: [],
          error: true,
          status: false,
        });
      }
    } else {
      // No cart data found
      return res.json({
        code: 404,
        message: "No cart data found.",
        data: [],
        error: true,
        status: false,
      });
    }
  } catch (err) {
    console.error(err);
    // Handle server errors
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
  // aaddTOCard
  createCart,
  putCart,
   getCart, 
  deleteCart, 
  getSingleCart, 
  // user...
    loginUser,
  createUser,
  putUser,
   getUser, 
  deleteUser, 
  getSingleUser 
   
}