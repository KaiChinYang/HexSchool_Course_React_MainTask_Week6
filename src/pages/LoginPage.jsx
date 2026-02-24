import { useState } from "react";
import api from "../api/axiosInstance";
export default function LoginPage({ setIsAuth, getProducts }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((preData) => ({ ...preData, [name]: value }));
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.login(formData);
      const { token, expired } = res.data;
      //設定cookie
      document.cookie = `PAPAYA_KG_TOKEN=${token};expires=${new Date(
        expired,
      )};`;
      setIsAuth(true);
      getProducts();
    } catch (error) {
      console.dir(error.response);
      setIsAuth(false);
      alert("登入失敗", error.response?.data.message);
    }
  };
  return (
    <div className="container login">
      <h1>WeeK5</h1>
      <h1 className="text-danger h3 mb-3">請先登入</h1>

      <form className="form-floating" onSubmit={handleLogin}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            placeholder="請輸入帳號"
            id="username"
          />
          <label>Email address</label>
        </div>

        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="請輸入密碼"
            id="password"
          />
          <label>Password</label>
        </div>

        <button className="btn btn-primary w-100 mt-2">登入</button>
      </form>
    </div>
  );
}
