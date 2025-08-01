import { HashRouter, Route, Routes } from 'react-router-dom';

import TokenBalanceDashboard from "./pages/TokenBalanceDashboard";
import NFTDashboard from "./pages/NFTDashboard";

function App() {

  return (
    <HashRouter>
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
