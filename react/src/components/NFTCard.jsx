export const NFTCard = ({ nft }) => {
  const chains = [
    { id: '1', name: 'Ethereum', color: 'bg-blue-500' },
    { id: '56', name: 'BSC', color: 'bg-yellow-500' },
    { id: '137', name: 'Polygon', color: 'bg-purple-500' },
    { id: '43114', name: 'Avalanche', color: 'bg-red-500' },
    { id: '250', name: 'Fantom', color: 'bg-blue-400' },
    { id: '42161', name: 'Arbitrum', color: 'bg-blue-600' },
    { id: '10', name: 'Optimism', color: 'bg-red-600' }
  ];

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getChainInfo = (chainId) => {
    return chains.find(chain => chain.id === chainId?.toString()) || 
           { name: `Chain ${chainId}`, color: 'bg-gray-500' };
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
        {nft.image_url ? (
          <img
            src={nft.image_url}
            alt={nft.name || 'NFT'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl hidden">
          {nft.name?.[0] || nft.token_id?.slice(-1) || '?'}
        </div>
        
        {/* Chain badge */}
        <div className={`absolute top-2 left-2 ${getChainInfo(nft.chainId).color} text-white px-2 py-1 rounded-full text-xs font-medium`}>
          {getChainInfo(nft.chainId).name}
        </div>
        
        {/* Provider badge */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
          {nft.provider}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">
          {nft.name || `Token #${nft.token_id}`}
        </h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Contract:</span>
            <span className="font-mono text-gray-800">{formatAddress(nft.asset_contract?.address)}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Token ID:</span>
            <span className="font-mono text-gray-800 truncate max-w-24" title={nft.token_id}>
              #{nft.token_id?.length > 10 ? nft.token_id.slice(0, 8) + '...' : nft.token_id}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Standard:</span>
            <span className="text-gray-800 uppercase">{nft.asset_contract?.schema_name}</span>
          </div>
        </div>
      </div>
    </div>
  )
};
