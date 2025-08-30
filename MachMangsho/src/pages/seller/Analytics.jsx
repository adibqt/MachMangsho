import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Legend
} from 'recharts';

const StatCard = ({ label, value }) => (
  <div className="flex-1 min-w-[160px] bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
  </div>
);

const Analytics = () => {
  const { axios, currency } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [locations, setLocations] = useState([]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ov, tr, tp, loc] = await Promise.all([
        axios.get('/api/seller/analytics/overview?range=30'),
        axios.get('/api/seller/analytics/trend?range=30'),
        axios.get('/api/seller/analytics/top-products?limit=8'),
        axios.get('/api/seller/analytics/locations?limit=8'),
      ]);
      setOverview(ov.data?.data || null);
      setTrend(tr.data?.data || []);
      setTopProducts(tp.data?.data || []);
      setLocations(loc.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Analytics</h1>
        <button onClick={fetchAll} className="text-sm px-3 py-1.5 bg-[#c9595a] text-white rounded">Refresh</button>
      </div>

      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Orders (30d)" value={overview.totalOrders} />
          <StatCard label="Items Sold (30d)" value={overview.totalItemsSold} />
          <StatCard label="Revenue (30d)" value={`${currency}${overview.totalRevenue}`} />
          <StatCard label="Payments" value={`COD: ${overview.paymentBreakdown?.COD || 0} / Online: ${overview.paymentBreakdown?.Online || 0}`} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm lg:col-span-2">
          <p className="text-sm text-gray-500 mb-2">Sales trend (last 30 days)</p>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <LineChart data={trend} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="orders" name="Orders" stroke="#c9595a" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke="#4f46e5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-2">Top locations</p>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <BarChart data={locations} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={(d) => `${d.city}`}
                       interval={0}
                       tick={{ fontSize: 11 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="itemsSold" name="Items" fill="#c9595a" />
                <Bar dataKey="orders" name="Orders" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <p className="text-sm text-gray-500 mb-3">Top products</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topProducts.map((p) => (
            <div key={p.productId} className="border border-gray-200 rounded-md p-3 flex items-center gap-3">
              <img src={p.image} alt="" className="w-12 h-12 object-cover rounded" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{p.name || 'Product'}</p>
                <p className="text-xs text-gray-500 truncate">{p.category || '-'}</p>
              </div>
              <div className="ml-auto text-sm font-semibold text-gray-800">{p.quantity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
