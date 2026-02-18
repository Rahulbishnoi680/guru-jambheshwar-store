import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import AddProduct from "./Pages/products/AddProduct";
import ProductList from "./Pages/products/ProductList";
import Notes from "./Pages/notes/Notes";
import BottomNav from "./components/BottomNav";
import Login from "./Pages/auth/Login";
import Header from "./Pages/Layout/Header";
import { isLoggedIn } from "./utils/auth";

const RequireAuth = () => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Header />
      <div className="pb-16">
        <Outlet />
      </div>
      <BottomNav />
    </>
  );
};

const Router = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RequireAuth />}>
            <Route index element={<Navigate to="/list" replace />} />
            <Route path="add" element={<AddProduct />} />
            <Route path="add/:id" element={<AddProduct />} />
            <Route path="list" element={<ProductList />} />
            <Route path="notes" element={<Notes />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Router;
