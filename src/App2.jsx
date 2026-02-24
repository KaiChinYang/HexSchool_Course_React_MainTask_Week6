import { useEffect, useState } from "react";
import "./assets/style.css";
import api from "./api/axiosInstance";

import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

function App() {
  const [products, setProducts] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [pagination, setPagination] = useState({});

  const checkLogin = async (e) => {
    try {
      const res = await api.checkLogin();
      console.log(res.data);
      setIsAuth(true);
      getProducts();
    } catch (error) {
      console.dir(error.response?.data.message);
    }
  };

  const getProducts = async (page = 1) => {
    try {
      const res = await api.getProducts(page);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.dir(error.response);
      alert("取得產品列表失敗", error.response?.data.message);
    }
  };

  //確認是否已登入，若已登入則取得產品列表
  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <>
      {isAuth ? (
        <AdminPage
          products={products}
          checkLogin={checkLogin}
          pagination={pagination}
          getProducts={getProducts}
        />
      ) : (
        <LoginPage setIsAuth={setIsAuth} getProducts={getProducts} />
      )}
    </>
  );
}

export default App;
