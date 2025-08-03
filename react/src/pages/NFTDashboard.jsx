import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, ExternalLink, Grid, List } from 'lucide-react';

import { NFTCard } from '../components/NFTCard';
import { NFTListItem } from '../components/NFTListItem';

const NFTDashboard = () => {
  const [address, setAddress] = useState('');
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedChain, setSelectedChain] = useState('1');
  const [viewMode, setViewMode] = useState('list');
  const [nextToken, setNextToken] = useState('');
  const [hasMore, setHasMore] = useState(true);
  
  const itemsPerPage = 12;

  const chains = [
    { id: '1', name: 'Ethereum', color: 'bg-blue-500' },
    { id: '56', name: 'BSC', color: 'bg-yellow-500' },
    { id: '137', name: 'Polygon', color: 'bg-purple-500' },
    { id: '43114', name: 'Avalanche', color: 'bg-red-500' },
    { id: '250', name: 'Fantom', color: 'bg-blue-400' },
    { id: '42161', name: 'Arbitrum', color: 'bg-blue-600' },
    { id: '10', name: 'Optimism', color: 'bg-red-600' }
  ];

  const fetchNFTs = async (pageNum = 1, loadMore = false) => {
    if (!address.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    setLoading(true);
    setError('');
    
    const offset = (pageNum - 1) * itemsPerPage;
    
    try {
      const response = await fetch(
        `http://localhost:4000/api/fetchNfts/${address}?limit=${itemsPerPage}&offset=${offset}&chainIds=${selectedChain}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch NFTs');
      }
      
      const data = await response.json();
      const assets = data.assets || [];
      
      if (loadMore) {
        setNfts(prev => [...prev, ...assets]);
      } else {
        setNfts(assets);
      }
      
      setNextToken(data.openseaNextToken || '');
      setHasMore(assets.length === itemsPerPage);
      setTotalCount(prev => loadMore ? prev + assets.length : assets.length);
      setCurrentPage(pageNum);
    } catch (err) {
      setError(err.message || 'Failed to fetch NFTs');
      if (!loadMore) {
        setNfts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setCurrentPage(1);
    fetchNFTs(1);
  };

  const handlePageChange = (newPage) => {
    fetchNFTs(newPage);
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getChainInfo = (chainId) => {
    return chains.find(chain => chain.id === chainId?.toString()) || 
           { name: `Chain ${chainId}`, color: 'bg-gray-500' };
  };

  const handleLoadMore = () => {
    fetchNFTs(currentPage + 1, true);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">NFT Dashboard</h1>
          <p className="text-gray-600">Explore NFTs across multiple blockchains</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                    placeholder="Enter wallet address (0x...)"
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
              
              <div className="md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blockchain
                </label>
                <select
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {chains.map(chain => (
                    <option key={chain.id} value={chain.id}>
                      {chain.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Loading...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Search NFTs
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Results Header */}
        {nfts.length > 0 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="text-gray-700">
              Found <span className="font-semibold">{nfts.length}</span> NFTs
              {address && (
                <span className="ml-2 text-gray-500">
                  for {formatAddress(address)}
                </span>
              )}
              {hasMore && (
                <span className="ml-2 text-indigo-600 text-sm">
                  (more available)
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        )}

        {/* NFTs Grid/List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="animate-spin mx-auto mb-4 text-indigo-600" size={40} />
            <p className="text-gray-600">Loading NFTs...</p>
          </div>
        ) : nfts.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {nfts.map((nft, index) => (
                  <NFTCard key={`${nft.asset_contract?.address}-${nft.token_id}-${index}`} nft={nft} />
                ))}
              </div>
            ) : (
              <div className="space-y-3 mb-8">
                {nfts.map((nft, index) => (
                  <NFTListItem key={`${nft.asset_contract?.address}-${nft.token_id}-${index}`} nft={nft} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && !loading && (
              <div className="flex justify-center mb-8">
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-colors duration-200 flex items-center gap-2"
                >
                  Load More NFTs
                </button>
              </div>
            )}
          </>
        ) : address && !loading ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No NFTs Found</h3>
            <p className="text-gray-600">
              No NFTs were found for this address on {getChainInfo(selectedChain).name}.
              <br />
              Try searching on a different blockchain or check the address.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NFTDashboard;
