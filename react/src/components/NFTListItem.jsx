export const NFTListItem = ({ nft }) => {
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
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex items-center gap-4">
      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
        {nft.image_url ? (
          <img
            src={nft.image_url}
            alt={nft.name || 'NFT'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold hidden">
          {nft.name?.[0] || nft.token_id?.slice(-1) || '?'}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">
          {nft.name || `Token #${nft.token_id}`}
        </h3>
        <p className="text-sm text-gray-600 truncate">
          {formatAddress(nft.asset_contract?.address)} • #{nft.token_id?.length > 10 ? nft.token_id.slice(0, 8) + '...' : nft.token_id}
        </p>
        <p className="text-xs text-gray-500">
          {nft.asset_contract?.schema_name?.toUpperCase()} • {nft.provider}
        </p>
      </div>
      
      <div className={`${getChainInfo(nft.chainId).color} text-white px-3 py-1 rounded-full text-xs font-medium`}>
        {getChainInfo(nft.chainId).name}
      </div>
    </div>
  );
};