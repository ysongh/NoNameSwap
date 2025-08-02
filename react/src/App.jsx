import { HashRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import TokenBalanceDashboard from "./pages/TokenBalanceDashboard";
import NFTDashboard from "./pages/NFTDashboard";

function App() {

  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route
          path="/nft"
         element={<NFTDashboard />} />
        <Route
          path="/"
          element={<TokenBalanceDashboard />} />
      </Routes>
    </HashRouter>
  )
}

export default App
