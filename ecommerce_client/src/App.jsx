import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Product from "./pages/Product";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import Orders from './pages/Orders';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useSelector } from "react-redux";

const App = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  return (
    <Router>
      <Routes>
      <Route
          path="/"
          element={
            currentUser ? (
              <Home />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/products/:category" element={<ProductList />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Router>
  );
};

export default App;
