import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const Navbar = () => {
  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/', icon: null },
    { name: 'NFTs', href: '/nft', icon: null },
    { name: 'Analytics', href: '#', icon: null },
    { name: 'About', href: '#', icon: null },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-purple-700 to-cyan-600 shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Tx</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent">
                TxInsight
              </h1>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-white hover:text-cyan-200 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white hover:bg-opacity-10 backdrop-blur-sm flex items-center space-x-1"
              >
                {item.icon && <item.icon size={16} />}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
