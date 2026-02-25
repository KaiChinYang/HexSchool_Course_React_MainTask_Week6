import { useEffect, useState } from "react";
import ProductsTable from "../components/ProductsTable";
import ProductDetail from "../components/ProductDetail";
import api from "../api/axiosInstance";

export default function AdminPage({
  // products,
  // checkLogin,
  // pagination,
  // getProducts,
}) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [tempProduct, setTempProduct] = useState(null);
  const [tempImgUrl, setTempImgUrl] = useState(null);

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
  const updateProducts = async (id, product, type) => {
    if (!product) {
      throw new Error("product is null");
    }
    const productData = {
      data: {
        ...product,
        origin_price: Number(product.origin_price || 0),
        price: Number(product.price || 0),
        is_enabled: product.is_enabled ? 1 : 0,
        imagesUrl: [...product.imagesUrl.filter((url) => url !== undefined)],
      },
    };
    try {
      const res = await api.updateProduct(type, id, productData);
      console.log(res.data.message);
      alert(res.data.message);
      await getProducts();
    } catch (error) {
      console.dir(error.response?.data.message);
    }
  };
  const deleteProduct = async (id) => {
    try {
      const res = await api.deleteProduct(id);
      console.log(res.data.message);
      alert(res.data.message);
      await getProducts();
    } catch (error) {
      console.dir(error.response?.data.message);
    }
  };
  const handleUpdateProduct = async (product, type, closeModal) => {
    if (!product) {
      console.error("product is null");
      return;
    }
    try {
      await updateProducts(product.id, product, type);
      closeModal(); // ⭐ 成功後關 modal
    } catch (error) {
      alert("更新產品失敗，請稍後再試");
      console.error(error);
    }
  };
  const handleDeleteProduct = async (product, closeModal) => {
    try {
      await deleteProduct(product.id);
      closeModal(); // ⭐ 成功後關 modal
    } catch (error) {
      alert("刪除產品失敗，請稍後再試");
      console.error(error);
    }
  };

  useEffect(()=>{
    getProducts();
  },[])
  return (
    <div className="container">
      <div className="row mt-5">
        <ProductsTable
          products={products}
          // checkLogin={checkLogin}
          pagination={pagination}
          getProducts={getProducts}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          // onSelectProduct={(product) => {
          //   setTempProduct(product);
          //   setTempImgUrl(product.imageUrl);
          // }}
        />
        {/* <ProductDetail
          products={products}
          product={tempProduct}
          tempImgUrl={tempImgUrl}
          setTempImgUrl={setTempImgUrl}
        /> */}
      </div>
    </div>
  );
}
