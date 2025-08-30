import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Helper to build date range filter
function buildDateMatch(query) {
  const match = {};
  const { from, to, range } = query || {};
  const now = new Date();
  if (from || to || range) {
    match.createdAt = {};
  }
  if (from) match.createdAt.$gte = new Date(from);
  if (to) match.createdAt.$lte = new Date(to);
  if (range) {
    const n = parseInt(range, 10);
    const days = Number.isFinite(n) ? n : 30;
    const since = new Date(now);
    since.setDate(now.getDate() - (days - 1));
    match.createdAt.$gte = match.createdAt.$gte ? new Date(Math.min(since, new Date(match.createdAt.$gte))) : since;
  }
  return match;
}

export async function analyticsOverview(req, res) {
  try {
    const match = buildDateMatch(req.query);

    const [counts] = await Order.aggregate([
      { $match: match },
      {
        $facet: {
          orders: [{ $count: "count" }],
          revenue: [{ $group: { _id: null, sum: { $sum: "$amount" } } }],
          items: [
            { $unwind: "$items" },
            { $group: { _id: null, qty: { $sum: "$items.quantity" } } },
          ],
          payment: [
            { $group: { _id: "$paymentType", count: { $sum: 1 }, paid: { $sum: { $cond: ["$isPaid", 1, 0] } } } },
          ],
        },
      },
    ]);

    const totalOrders = counts?.orders?.[0]?.count || 0;
    const totalRevenue = Math.round((counts?.revenue?.[0]?.sum || 0) * 100) / 100;
    const totalItemsSold = counts?.items?.[0]?.qty || 0;
    const paymentBreakdown = (counts?.payment || []).reduce((acc, p) => {
      acc[p._id || "Unknown"] = p.count;
      return acc;
    }, {});

    return res.json({ success: true, data: { totalOrders, totalRevenue, totalItemsSold, paymentBreakdown } });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
}

export async function salesTrend(req, res) {
  try {
    const match = buildDateMatch({ range: req.query.range || "30" });
    const tz = req.query.tz || "UTC";
    const data = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: tz } },
          orders: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return res.json({ success: true, data });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
}

export async function topProducts(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit || "8", 10), 50);
    const match = buildDateMatch(req.query);
    const data = await Order.aggregate([
      { $match: match },
      { $unwind: "$items" },
    { $group: { _id: "$items.product", quantity: { $sum: "$items.quantity" } } },
    // Convert string product id to ObjectId for lookup
    { $addFields: { productIdObj: { $convert: { input: "$_id", to: "objectId", onError: null, onNull: null } } } },
      { $sort: { quantity: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
      localField: "productIdObj",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: "$product.name",
          category: "$product.category",
          image: { $arrayElemAt: ["$product.images", 0] },
          quantity: 1,
        },
      },
    ]);
    return res.json({ success: true, data });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
}

export async function topLocations(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit || "8", 10), 50);
    const match = buildDateMatch(req.query);
    const data = await Order.aggregate([
      { $match: match },
    // Convert string address id to ObjectId for lookup
    { $addFields: { addressIdObj: { $convert: { input: "$address", to: "objectId", onError: null, onNull: null } } } },
      {
        $lookup: {
          from: "addresses",
      localField: "addressIdObj",
          foreignField: "_id",
          as: "addr",
        },
      },
      { $unwind: { path: "$addr", preserveNullAndEmptyArrays: true } },
      { $unwind: "$items" },
      {
        $group: {
          _id: {
            city: { $ifNull: ["$addr.city", "Unknown"] },
            country: { $ifNull: ["$addr.country", "-"] },
          },
          orders: { $sum: 1 },
          itemsSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { itemsSold: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          city: "$_id.city",
          country: "$_id.country",
          orders: 1,
          itemsSold: 1,
        },
      },
    ]);
    return res.json({ success: true, data });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
}

export default { analyticsOverview, salesTrend, topProducts, topLocations };
