import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function TokenDetail() {
  const { tokenAddress } = useParams();

  const [priceData, setPriceData] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState('');
  const [tokenDetail, setTokenDetail] = useState(null);

  useEffect(() => {
    fetchTokenDetail();
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

  const fetchTokenDetail= async () => {    
    try {
      const response = await fetch(`http://localhost:4000/gettokendetail/${tokenAddress}`);
      const result = await response.json();
      console.log(result.assets);
      setTokenDetail(result.assets);
      
      if (!response.ok) {
        throw new Error('Failed to fetch token prices');
      }
      
    } catch (err) {
      console.error(err);
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
    <div>
      <div className="space-y-6">
        {/* Main Token Info */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                {tokenDetail?.symbol ? tokenDetail?.symbol.charAt(0) : '?'}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{tokenDetail?.name || 'Unknown Token'}</h1>
                <p className="text-xl opacity-90">{tokenDetail?.symbol || 'N/A'}</p>
                <p className="text-sm opacity-75">{tokenDetail?.type || 'ERC20'}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Token Address */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contract Address</h3>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <code className="text-sm font-mono text-gray-800 break-all">
                  {tokenDetail?.id || tokenAddress}
                </code>
                <a
                  href={tokenDetail?.explorer || `https://etherscan.io/token/${tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm ml-4"
                >
                  <ExternalLink className="h-4 w-4" />
                  Explorer
                </a>
              </div>
            </div>

            {/* Token Properties */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Token Properties</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Decimals</span>
                    <span className="font-medium">{tokenDetail?.decimals || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tokenDetail?.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tokenDetail?.status || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium">{tokenDetail?.type || 'ERC20'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Official Links</h3>
                <div className="space-y-2">
                  {tokenDetail?.website && (
                    <a
                      href={tokenDetail?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 py-1"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {tokenDetail?.links && tokenDetail?.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 py-1 capitalize"
                    >
                      {renderLinkIcon(link.type)}
                      {link.type || 'Link'}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            {tokenDetail?.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{tokenDetail?.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
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
    </div>
  )
}

export default TokenDetail