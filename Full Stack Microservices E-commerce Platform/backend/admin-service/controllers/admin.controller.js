import axios from "axios";

const USER_SVC = process.env.USER_SERVICE_URL;
const PROD_SVC = process.env.PRODUCT_SERVICE_URL;
const ORDER_SVC = process.env.ORDER_SERVICE_URL;


export const listUsers = async (req, res) => {
  try {
    const resp = await axios.get(`${USER_SVC}/api/auth/users`);
    return res.json({ success: true, users: resp.data });
  } catch (err) {
    console.error("listUsers error:", err.message);
    return res.status(500).json({ success:false, message: "Failed to fetch users" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await axios.delete(`${USER_SVC}/api/users/${id}`, {
      headers: { "authorization": req.headers["authorization"] } // forward admin token if required
    });
    return res.json({ success:true, message: "User deleted" });
  } catch (err) {
    console.error("deleteUser error:", err.message);
    return res.status(500).json({ success:false, message: "Failed to delete user" });
  }
};

export const listProductsProxy = async (req, res) => {
  try {
    const resp = await axios.get(`${PROD_SVC}/api/products`);
    return res.json({ success:true, products: resp.data });
  } catch (err) {
    console.error("listProducts error:", err.message);
    return res.status(500).json({ success:false, message: "Failed to fetch products" });
  }
};

export const deleteProductProxy = async (req, res) => {
  const { id } = req.params;
  try {
    await axios.delete(`${PROD_SVC}/api/products/${id}`, {
      headers: { "authorization": req.headers["authorization"] }
    });
    return res.json({ success:true, message: "Product deleted" });
  } catch (err) {
    console.error("deleteProduct error:", err.message);
    return res.status(500).json({ success:false, message: "Failed to delete product" });
  }
};

export const listOrdersProxy = async (req, res) => {
  try {
    const query = req.query || {};
    const resp = await axios.get(`${ORDER_SVC}/api/orders`, { params: query });
    return res.json({ success:true, orders: resp.data });
  } catch (err) {
    console.error("listOrders error:", err.message);
    return res.status(500).json({ success:false, message: "Failed to fetch orders" });
  }
};

export const getDashboardOverview = async (req, res) => {
  try {
    const token = req.headers["authorization"];

    const [usersResp, productsResp, ordersResp] = await Promise.all([
      axios.get(`${USER_SVC}/api/auth/users`, { headers: { Authorization: token } }),
      axios.get(`${PROD_SVC}/api/products/`, { headers: { Authorization: token } }),
      axios.get(`${ORDER_SVC}/api/orders/`, { headers: { Authorization: token } }),
    ]);

    const usersData = usersResp.data;
    const productsData = productsResp.data;
    const ordersData = ordersResp.data;

    const totalUsers = usersData['data'].length || 0;
    const totalProducts = productsData.length || 0;
    const totalOrders = ordersData['data'].length || 0;
    const totalRevenue = ordersData['data'].reduce((sum, order) => {
      const amt = (order && (order.totalAmount ?? order.total ?? 0));
      return sum + Number(amt || 0);
    }, 0);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (err) {
    console.error("getDashboardOverview error:", err?.response?.data ?? err.message ?? err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to generate dashboard" });
  }
};
