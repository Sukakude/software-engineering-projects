import axios from "axios";

const ORDER_SVC = process.env.ORDER_SERVICE_URL;
const PROD_SVC = process.env.PRODUCT_SERVICE_URL;

export const salesReport = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const { startDate, endDate } = req.query;
    const params = {};
    if (startDate) params.start = startDate;
    if (endDate) params.end = endDate;

    const resp = await axios.get(`${ORDER_SVC}/api/orders?startDate=${startDate}&endDate=${endDate}`, {
      headers: { Authorization: token }
    });

    const orders = resp.data.orders || resp.data; 

    const totalRevenue = orders['data'].reduce((s, o) => s + (o.totalAmount || 0), 0);
    const totalOrders = orders['data'].length;

    return res.json({ success:true, totalRevenue, totalOrders, from: startDate, to: endDate });
  } catch (err) {
    console.error("salesReport error:", err.message);
    return res.status(500).json({ success:false, message: "Failed to generate sales report" });
  }
};

export const inventoryReport = async (req, res) => {
  try {
    const resp = await axios.get(`${PROD_SVC}/api/products/`);
    const products = resp.data || [];

    // find low stock
    const lowStock = products.filter(p => p.stock !== undefined && p.stock <= (req.query.threshold ? Number(req.query.threshold) : 10));
    const totalProducts = products.length;

    return res.json({ success:true, totalProducts, lowStockCount: lowStock.length, lowStock });
  } catch (err) {
    console.error("inventoryReport error:", err.message);
    return res.status(500).json({ success:false, message: "Failed to generate inventory report" });
  }
};
