import axios from "axios";

const API_PATH = import.meta.env.VITE_API_PATH;

const api = axios.create({
  baseURL: "https://ec-course-api.hexschool.io/v2",
});

// =====================
// Request Interceptor
// =====================
api.interceptors.request.use(
  (config) => {
    // 從 cookie 讀 token
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("PAPAYA_KG_TOKEN="))
      ?.split("=")[1];
    // 修改實體建立時所指派的預設配置
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// =====================
// API methods
// =====================
//登入API
api.login = (payload) => api.post("/admin/signin", payload);
//驗證登入API
api.checkLogin = () => api.post("/api/user/check");
//取得產品API
api.getProducts = (page = 1) =>
  api.get(`/api/${API_PATH}/admin/products?page=${page}`);
//新增or更新產品API
api.updateProduct = (type, id, data) =>
  api[type === "create" ? "post" : "put"](
    `/api/${API_PATH}/admin/product${type === "edit" ? `/${id}` : ""}`,
    data,
  );
//新增產品API
api.addProduct = (data) => api.post(`/api/${API_PATH}/admin/product`, data);
//更新產品API
api.editProduct = (id, data) =>
  api.put(`/api/${API_PATH}/admin/product/${id}`, data);
//刪除產品API
api.deleteProduct = (id) => api.delete(`/api/${API_PATH}/admin/product/${id}`);
//上傳圖片API
api.uploadImage = (formData) =>
  api.post(`/api/${API_PATH}/admin/upload`, formData);
//---------------------------------------------------------------客戶端
//取得客戶端全部產品API
api.clientGetProducts = () => api.get(`/api/${API_PATH}/products/all`);
//取得客戶端單一產品API
api.clientGetSingleProduct = (id) => api.get(`/api/${API_PATH}/product/${id}`);
//加入購物車API
api.addCart = (data) => api.post(`/api/${API_PATH}/cart`, { data });
//取得購物車資料API
api.getCart = () => api.get(`/api/${API_PATH}/cart`);
//更新購物車資料API
api.updateCart = (id, data) => api.put(`/api/${API_PATH}/cart/${id}`, { data });
//刪除單一購物車資料API
api.deleteCart = (id) => api.delete(`/api/${API_PATH}/cart/${id}`);
//清空購物車API
api.clearCarts = () => api.delete(`/api/${API_PATH}/carts`);
export default api;
