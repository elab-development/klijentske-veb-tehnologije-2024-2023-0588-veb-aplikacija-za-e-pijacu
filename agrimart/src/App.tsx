import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import Products from './pages/Products';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Layout from './components/Layout';

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/products' element={<Products />} />
            <Route path='/products/:id' element={<Product />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/checkout' element={<Checkout />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;
