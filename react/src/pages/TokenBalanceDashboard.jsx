import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Wallet, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';

const TokenBalanceDashboard = () => {
  const navigate = useNavigate();

  const [walletAddress, setWalletAddress] = useState('');
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBalance = async () => {
    if (!walletAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:4000/getBalance/${walletAddress}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch balance');
      }
      
      setBalanceData(result.data);
    } catch (err) {
      setError(err.message);
      setBalanceData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    fetchBalance();
  };

  const formatBalance = (balance, decimals) => {
    if (!balance || !decimals) return '0';
    const divisor = Math.pow(10, parseInt(decimals));
    const formatted = (parseInt(balance) / divisor).toFixed(6);
    return parseFloat(formatted).toString();
  };

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Wallet className="h-10 w-10 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Token Balance Dashboard</h1>
          </div>
          <p className="text-gray-600 text-lg">View ERC-20 token balances for any Ethereum address</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter Ethereum wallet address (0x...)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                  onKeyDown={(e) => e.key === 'Enter' && fetchBalance()}
                />
              </div>
            </div>
            <button
              onClick={fetchBalance}
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Get Balance
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results */}
        {balanceData && (
          <div className="space-y-6">
            {/* Address Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Wallet className="h-6 w-6 text-indigo-600" />
                Wallet Address
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <code className="text-sm font-mono text-gray-800 break-all">
                  {walletAddress}
                </code>
                <a
                  href={`https://etherscan.io/address/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  Etherscan
                </a>
              </div>
            </div>

            {/* Token Balances */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Token Balances</h2>
                <p className="text-gray-600 mt-1">
                  {Object.keys(balanceData).length} tokens found
                </p>
              </div>

              {Object.keys(balanceData).length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 text-lg">No tokens found for this address</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Token
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contract Address
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(balanceData).map(([address, tokenData]) => (
                        <tr key={address} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                {tokenData.symbol ? tokenData.symbol.charAt(0) : '?'}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {tokenData.symbol || 'Unknown'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {tokenData.name || 'Unknown Token'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap" onClick={() => navigate(`/token/${address}`)}>
                            <code className="text-xs font-mono text-gray-600">
                              {shortenAddress(address)}
                            </code>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {formatBalance(tokenData.balance, tokenData.decimals)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {tokenData.symbol || 'tokens'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <a
                              href={`https://etherscan.io/token/${address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-900 text-sm flex items-center justify-center gap-1"
                            >
                              <ExternalLink className="h-4 w-4" />
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by 1inch API • Data refreshed on each search</p>
        </div>
      </div>
    </div>
  );
};

export default TokenBalanceDashboard;
