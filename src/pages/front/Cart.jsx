import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { currency } from "../../utils/filter";
export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await api.getCart();
        setCart(response.data.data);
      } catch (error) {
        alert(error);
      }
    };
    getCart();
  }, []);

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
    //確認使用者是否真的要清除該筆商品
    if (!window.confirm("確定要清除該筆商品嗎？")) {
      return;
    }
    try {
      const response = await api.deleteCart(cardId);
      const response2 = await api.getCart();
      setCart(response2.data.data);
      alert("已成功刪除該筆商品");
    } catch (error) {
      alert(error);
    }
  };
  const clearCart = async () => {
    // 確認使用者是否真的要清空購物車
    if (!window.confirm("確定要清空購物車嗎？")) {
      return;
    }
    try {
      const response = await api.clearCarts();
      const response2 = await api.getCart();
      setCart(response2.data.data);
      alert("已清空購物車");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="container">
      <h2>購物車列表</h2>
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => clearCart()}
        >
          清空購物車
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
                  刪除
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
                    defaultValue={cartItem.qty}
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
    </div>
  );
}
