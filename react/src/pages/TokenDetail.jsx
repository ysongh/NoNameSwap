import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function TokenDetail() {
  const { tokenAddress } = useParams();

  const [priceData, setPriceData] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState('');

  useEffect(() => {
    fetchTokenPrices();
  }, [tokenAddress])
  
  const fetchTokenPrices = async () => {
    setPriceLoading(true);
    setPriceError('');
    
    try {
      console.log(tokenAddress)
      const response = await fetch(`http://localhost:4000/api/${tokenAddress}/prices/7d`);
      const result = await response.json();
      console.log(`http://localhost:4000/api/${tokenAddress}/prices/7d`);
      console.log(result);
      
      if (!response.ok) {
        throw new Error('Failed to fetch token prices');
      }
      
      // Transform the data for the chart
      const chartData = result.map((item, index) => ({
        time: new Date(item.t * 1000).toLocaleDateString(),
        price: parseFloat(item.v),
        timestamp: item.t
      }));
      
      setPriceData(chartData);
    } catch (err) {
      setPriceError(err.message);
      setPriceData(null);
    } finally {
      setPriceLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price < 0.01) {
      return `$${price.toFixed(6)}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-gray-900 font-semibold">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Price Chart (Past Week)</h2>
      
      {priceLoading && (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="ml-2 text-gray-600">Loading price data...</span>
        </div>
      )}

      {priceError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{priceError}</p>
        </div>
      )}

      {priceData && !priceLoading && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                tickFormatter={formatPrice}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#4f46e5" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#4f46e5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default TokenDetail