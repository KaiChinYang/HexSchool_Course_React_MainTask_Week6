import { useState } from "react";
import api from "../api/axiosInstance";
import { useForm } from "react-hook-form";
import { emailValidation } from "../utils/validation";
import { useNavigate } from "react-router";
export default function LoginPage({ setIsAuth, getProducts }) {
  // const [formData, setFormData] = useState({
  //   username: "",
  //   password: "",
  // });
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((preData) => ({ ...preData, [name]: value }));
  };
  const onSubmit = async (formData) => {
    try {
      const res = await api.login(formData);
      console.log(res.data);  
      const { token, expired } = res.data;
      //設定cookie
      document.cookie = `PAPAYA_KG_TOKEN=${token};expires=${new Date(
        expired,
      )};`;
      navigate('/products');
      // setIsAuth(true);
      // getProducts();
    } catch (error) {
      console.dir(error.response);
      // setIsAuth(false);
      alert("帳號或密碼錯誤", error.response?.data.message);
    }
  };
  return (
    <div className="container login">
      <h1>WeeK6</h1>
      <h1 className="text-danger h3 mb-3">請先登入</h1>

      <form className="form-floating" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            name="username"
            // value={formData.username}
            // onChange={handleInputChange}
            required
            placeholder="請輸入信箱"
            id="username"
            {...register("username", emailValidation)}
          />
          {errors.username && (
            <p className="text-danger">{errors.username.message}</p>
          )}
          <label>Email address</label>
        </div>

        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            name="password"
            // value={formData.password}
            // onChange={handleInputChange}
            required
            placeholder="請輸入密碼"
            id="password"
            {...register("password", {
              required: "請輸入密碼",
              minLength: {
                value: 6,
                message: "密碼長度至少需 6 碼",
              },
            })}
          />
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
          <label>Password</label>
        </div>

        <button className="btn btn-primary w-100 mt-2" disabled={!isValid}>登入</button>
      </form>
    </div>
  );
}
