import { BrowserRouter, Route, Routes } from "react-router-dom";
import Shop from "./Pages/shop/shop";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shop />} />{" "}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
