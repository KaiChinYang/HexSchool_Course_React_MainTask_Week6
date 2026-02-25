import { useEffect, useRef, useState } from "react";
import api from "../../api/axiosInstance";
import { currency } from "../../utils/filter";
import { useForm } from "react-hook-form";
import { Vortex } from "react-loader-spinner";
import * as bootstrap from "bootstrap";
import SingleProductModal from "../../components/SingleProductModal";
import { emailValidation } from "../../utils/validation";
export default function Checkout() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [cartQty, setCartQty] = useState(1);

  const [cart, setCart] = useState([]);
  const [loadingCardId, setLoadingCardId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const productModalRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await api.clientGetProducts();
        console.log(response.data);
        setProducts(response.data.products);
      } catch (error) {
        alert(error);
      }
    };
    getProducts();
    const getCart = async () => {
      try {
        const response = await api.getCart();
        setCart(response.data.data);
      } catch (error) {
        alert(error);
      }
    };
    getCart();

    //初始化Ref
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
    // Modal 關閉時移除焦點
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
  }, []);

  //查看更多
  const getSingleProduct = async (id) => {
    setLoadingProductId(id);
    try {
      const response = await api.clientGetSingleProduct(id);
      console.log(response.data);
      setProduct(response.data.product);
    } catch (error) {
      alert(error);
    } finally {
      setLoadingProductId(null);
    }
    setCartQty(1);
    productModalRef.current.show();
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };
  //加到購物車
  async function addCart(id, qty = 1) {
    setLoadingCardId(id);
    try {
      const data = {
        product_id: id,
        qty,
      };
      const response = await api.addCart(data);
      console.log(response.data);
      //刷新購物車
      const response2 = await api.getCart();
      setCart(response2.data.data);
    } catch (error) {
      alert(error);
    } finally {
      setLoadingCardId(null);
    }
  }

  const updateCart = async (cardId, productId, qty = 1) => {
    try {
      const data = {
        product_id: productId,
        qty,
      };
      const response = await api.updateCart(cardId, data);
      const response2 = await api.getCart();
      setCart(response2.data.data);
    } catch (error) {
      alert(error);
    }
  };
  const deleteCart = async (cardId) => {
    setLoadingProductId(cardId);
    //確認使用者是否真的要清除該筆商品
    if (!window.confirm("確定要清除該筆商品嗎？")) {
      return;
    }
    try {
      const response = await api.deleteCart(cardId);
      const response2 = await api.getCart();
      setCart(response2.data.data);
      // alert("已成功刪除該筆商品");
    } catch (error) {
      alert(error);
    } finally {
      setLoadingProductId(null);
    }
  };
  const clearCart = async () => {
    setIsLoading(true);
    // 確認使用者是否真的要清空購物車
    if (!window.confirm("確定要清空購物車嗎？")) {
      return;
    }
    try {
      const response = await api.clearCarts();
      const response2 = await api.getCart();
      setCart(response2.data.data);
      // alert("已清空購物車");
    } catch (error) {
      alert(error);
    } finally{
      setIsLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    console.log(formData);
    try {
      const data = {
        user: formData,
        message: formData.message,
      };
      const response = await api.sendOrder(data);
      //刷新購物車
      const response2 = await api.getCart();
      setCart(response2.data.data);
      alert("已成功送出訂單");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="container">
      {/* 產品列表 */}
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: "200px" }}>
                <div
                  style={{
                    height: "100px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${product.imageUrl})`,
                  }}
                ></div>
              </td>
              <td>{product.title}</td>
              <td>
                <del className="h6">原價：{product.origin_price}</del>
                <div className="h5">特價：{product.price}</div>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => getSingleProduct(product.id)}
                    disabled={loadingProductId === product.id}
                  >
                    {loadingProductId === product.id ? (
                      <Vortex
                        height={16}
                        colors={["blue", "yellow", "orange"]}
                      />
                    ) : (
                      "查看更多"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => addCart(product.id)}
                    disabled={loadingCardId === product.id}
                  >
                    {loadingCardId === product.id ? (
                      <Vortex
                        height={16}
                        colors={["blue", "yellow", "orange"]}
                      />
                    ) : (
                      "加到購物車"
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>購物車列表</h2>
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => clearCart()}
          disabled={cart.carts?.length === 0}
        >
          {isLoading ? (
            <Vortex height={16} colors={["blue", "yellow", "orange"]} />
          ) : (
            "清空購物車"
          )}
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">品名</th>
            <th scope="col">數量/單位</th>
            <th scope="col">小計</th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts?.map((cartItem) => (
            <tr key={cartItem.id}>
              <td>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={(e) => deleteCart(cartItem.id)}
                >
                  {loadingProductId === cartItem.id ? (
                    <Vortex height={16} colors={["blue", "yellow", "orange"]} />
                  ) : (
                    "刪除"
                  )}
                </button>
              </td>
              <th scope="row">{cartItem.product.title}</th>
              <td>
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                    value={cartItem.qty}
                    onChange={(event) =>
                      updateCart(
                        cartItem.id,
                        cartItem.product.id,
                        Number(event.target.value),
                      )
                    }
                  />
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                  >
                    {cartItem.product.unit}
                  </span>
                </div>
              </td>
              <td className="text-end">{currency(cartItem.final_total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-end" colSpan="3">
              總計
            </td>
            <td className="text-end">{currency(cart.final_total)}</td>
          </tr>
        </tfoot>
      </table>
      {/* 結帳頁面 */}
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="請輸入 Email"
              defaultValue="test@gamil.com"
              {...register("email", emailValidation)}
            />
            {errors.email && (
              <p className="text-danger mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="請輸入姓名"
              defaultValue="小明"
              {...register("name", {
                required: "姓名為必填",
                minLength: {
                  value: 2,
                  message: "姓名至少需2個字",
                },
              })}
            />
            {errors.name && (
              <p className="text-danger mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              name="tel"
              type="tel"
              className="form-control"
              placeholder="請輸入電話"
              defaultValue="0912345678"
              {...register("tel", {
                required: "電話為必填",
                pattern: {
                  value: /^\d+$/,
                  message: "電話僅能輸入數字",
                },
                minLength: {
                  value: 8,
                  message: "電話最少 8 碼",
                },
              })}
            />
            {errors.tel && (
              <p className="text-danger mt-1">{errors.tel.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-control"
              placeholder="請輸入地址"
              defaultValue="臺北市信義區信義路5段7號"
              {...register("address", {
                required: "地址為必填",
              })}
            />
            {errors.address && (
              <p className="text-danger mt-1">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register("message", {})}
            ></textarea>
          </div>
          <div className="text-end">
            <button
              type="submit"
              className="btn btn-danger"
              disabled={cart.carts?.length === 0}
            >
              送出訂單
            </button>
          </div>
        </form>
      </div>
      <SingleProductModal
        product={product}
        addCart={addCart}
        closeModal={closeModal}
        ref={productModalRef}
        cartQty={cartQty}
        setCartQty={setCartQty}
      />
    </div>
  );
}
