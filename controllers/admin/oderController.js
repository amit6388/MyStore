const InstructorRegisterSchema = require('../../models/admin/InstructorModel'); 
const OrderTable = require('../../models/admin/Orders');

const createOrder = async (req, res) => {
  try {
    const { userId, products, totalPrice, shippingAddress,orderStatus,paymentStatus } = req.body;

    // Validation for missing fields
    if (!userId || !products || !totalPrice || !shippingAddress) {
      return res.status(400).json({
        code: 400,
        message: "Missing required fields.",
        error: true,
        status: false,
        data: []
      });
    }

    // Create a new order
    const newOrder = new OrderTable({
      userId,
      products,
      totalPrice,
      shippingAddress,
      orderStatus,
      paymentStatus
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({
      code: 201,
      message: "Order created successfully.",
      error: false,
      status: true,
      data: savedOrder
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: "An internal server error occurred.",
      error: true,
      status: false,
      data: []
    });
  }
};

const putOrder = async (req, res) => {
      try {
        const { orderStatus, paymentStatus } = req.body;
        
        const updatedOrder = await OrderTable.findByIdAndUpdate(req.params.id, {
          orderStatus,
          paymentStatus,
          updatedAt: Date.now()
        }, { new: true }); // { new: true } returns the updated order
    
        if (!updatedOrder) {
          return res.status(404).json({
            code: 404,
            message: "Order not found.",
            error: true,
            status: false,
            data: []
          });
        }
    
        return res.status(200).json({
          code: 200,
          message: "Order updated successfully.",
          error: false,
          status: true,
          data: updatedOrder
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({
          code: 500,
          message: "An internal server error occurred.",
          error: true,
          status: false,
          data: []
        });
      }
    } ;

    const deleteOder=  async (req, res) => {
          try {
            const deletedOrder = await OrderTable.findByIdAndDelete(req.params.id);
        
            if (!deletedOrder) {
              return res.status(404).json({
                code: 404,
                message: "Order not found.",
                error: true,
                status: false,
                data: []
              });
            }
        
            return res.status(200).json({
              code: 200,
              message: "Order deleted successfully.",
              error: false,
              status: true,
              data: deletedOrder
            });
          } catch (err) {
            console.error(err);
            return res.status(500).json({
              code: 500,
              message: "An internal server error occurred.",
              error: true,
              status: false,
              data: []
            });
          }
        };

        const getOrders=  async (req, res) => {
              try {
                const order = await OrderTable.findById(req.params.id).populate('userId').populate('products.productId');
            
                if (!order) {
                  return res.status(404).json({
                    code: 404,
                    message: "Order not found.",
                    error: true,
                    status: false,
                    data: []
                  });
                }
            
                return res.status(200).json({
                  code: 200,
                  message: "Order retrieved successfully.",
                  error: false,
                  status: true,
                  data: order
                });
              } catch (err) {
                console.error(err);
                return res.status(500).json({
                  code: 500,
                  message: "An internal server error occurred.",
                  error: true,
                  status: false,
                  data: []
                });
              }
            };


            const getOrderByUserId=  async (req, res) => {
              try {
                const order = await OrderTable.findById({userId:req.params.id}).populate('userId').populate('products.productId');
                //block for single user status 
            
                if (!order) {
                  return res.status(404).json({
                    code: 404,
                    message: "Order not found.",
                    error: true,
                    status: false,
                    data: []
                  });
                }
            
                return res.status(200).json({
                  code: 200,
                  message: "Order retrieved successfully.",
                  error: false,
                  status: true,
                  data: order
                });
              } catch (err) {
                console.error(err);
                return res.status(500).json({
                  code: 500,
                  message: "An internal server error occurred.",
                  error: true,
                  status: false,
                  data: []
                });
              }
            };

module.exports = {
  createOrder,
  putOrder,
  deleteOder,
  getOrders,
  getOrderByUserId
};


// app.post('/api/orders', async (req, res) => {
//   try {
//     const { userId, products, totalPrice, shippingAddress } = req.body;

//     // Validation for missing fields
//     if (!userId || !products || !totalPrice || !shippingAddress) {
//       return res.status(400).json({
//         code: 400,
//         message: "Missing required fields.",
//         error: true,
//         status: false,
//         data: []
//       });
    

//     // Create a new order
//     const newOrder = new OrderTable({
//       userId,
//       products,
//       totalPrice,
//       shippingAddress,
//       orderStatus: 'pending',
//       paymentStatus: 'pending'
//     });

//     const savedOrder = await newOrder.save();

//     return res.status(201).json({
//       code: 201,
//       message: "Order created successfully.",
//       error: false,
//       status: true,
//       data: savedOrder
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       code: 500,
//       message: "An internal server error occurred.",
//       error: true,
//       status: false,
//       data: []
//     });
//   }
// });

// Get all orders
// app.get('/api/orders', async (req, res) => {
//   try {
//     const orders = await OrderTable.find().populate('userId').populate('products.productId');
    
//     return res.status(200).json({
//       code: 200,
//       message: "Orders retrieved successfully.",
//       error: false,
//       status: true,
//       data: orders
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       code: 500,
//       message: "An internal server error occurred.",
//       error: true,
//       status: false,
//       data: []
//     });
//   }
// });

// Get a single order by ID
// app.get('/api/orders/:id', async (req, res) => {
//   try {
//     const order = await OrderTable.findById(req.params.id).populate('userId').populate('products.productId');

//     if (!order) {
//       return res.status(404).json({
//         code: 404,
//         message: "Order not found.",
//         error: true,
//         status: false,
//         data: []
//       });
//     }

//     return res.status(200).json({
//       code: 200,
//       message: "Order retrieved successfully.",
//       error: false,
//       status: true,
//       data: order
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       code: 500,
//       message: "An internal server error occurred.",
//       error: true,
//       status: false,
//       data: []
//     });
//   }
// });

// Update an order's status or payment status
// app.put('/api/orders/:id', async (req, res) => {
//   try {
//     const { orderStatus, paymentStatus } = req.body;
    
//     const updatedOrder = await OrderTable.findByIdAndUpdate(req.params.id, {
//       orderStatus,
//       paymentStatus,
//       updatedAt: Date.now()
//     }, { new: true }); // { new: true } returns the updated order

//     if (!updatedOrder) {
//       return res.status(404).json({
//         code: 404,
//         message: "Order not found.",
//         error: true,
//         status: false,
//         data: []
//       });
//     }

//     return res.status(200).json({
//       code: 200,
//       message: "Order updated successfully.",
//       error: false,
//       status: true,
//       data: updatedOrder
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       code: 500,
//       message: "An internal server error occurred.",
//       error: true,
//       status: false,
//       data: []
//     });
//   }
// });

// Delete an order
// app.delete('/api/orders/:id', async (req, res) => {
//   try {
//     const deletedOrder = await OrderTable.findByIdAndDelete(req.params.id);

//     if (!deletedOrder) {
//       return res.status(404).json({
//         code: 404,
//         message: "Order not found.",
//         error: true,
//         status: false,
//         data: []
//       });
//     }

//     return res.status(200).json({
//       code: 200,
//       message: "Order deleted successfully.",
//       error: false,
//       status: true,
//       data: deletedOrder
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       code: 500,
//       message: "An internal server error occurred.",
//       error: true,
//       status: false,
//       data: []
//     });
//   }
// });
 