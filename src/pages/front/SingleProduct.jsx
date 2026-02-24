import  { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../api/axiosInstance";

export default function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const response = await api.clientGetSingleProduct(id);
        setProduct(response.data.product);
      } catch (error) {
        alert(error);
      }
    };
    getSingleProduct();
  }, [id]);

  async function addCart(id,qty=1){
    try {
      const data = {
        product_id:id,
        qty
      }
      const response = await api.addCart(data);
      console.log(response.data);
      alert("已成功加入購物車");
    } catch (error) {
      alert(error);
    }
  }

  return !product ? (
    <h2>查無此產品資訊</h2>
  ) : (
    <div className="container mt-3">
      <div className="card " style={{ width: "18rem" }}>
        <img
          src={product.imageUrl}
          className="card-img-top"
          alt={product.title}
        />
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">{product.description}</p>
          <p className="card-text">原價: ${product.origin_price}</p>
          <p className="card-text">售價: ${product.price}</p>
          <p className="card-text">
            <small className="text-body-secondary">{product.unit}</small>
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => addCart(product.id)}
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}
