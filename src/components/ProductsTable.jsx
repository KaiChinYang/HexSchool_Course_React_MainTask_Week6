import * as bootstrap from "bootstrap";
import { useEffect, useState } from "react";
import { useRef } from "react";
import ProductModal from "./ProductModal";
import Pagination from "./Pagination";
export default function ProductsTable({
  products,
  pagination,
  getProducts,
  onUpdateProduct,
  onDeleteProduct,
}) {
  //建立空資料串
  const INITIAL_TEMPLETE_DATA = {
    id: "",
    title: "",
    category: "",
    origin_price: "",
    price: "",
    unit: "",
    description: "",
    content: "",
    is_enabled: false,
    imageUrl: "",
    imagesUrl: [],
    size: "",
  };
  const [templeteProduct, setTempleteProduct] = useState(INITIAL_TEMPLETE_DATA);
  const [modalAction, setModalAction] = useState("");
  // useRef 建立對 DOM 元素的參照
  const productModalRef = useRef(null);
  useEffect(() => {
    //Ref綁定modal
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
    //Modal 關閉時移除焦點
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
  }, []);

  function openModal(product, type) {
    setModalAction(type);
    // 根據操作類型決定要顯示的資料
    if (type === "create") {
      // 新增：只用空白模板
      setTempleteProduct(INITIAL_TEMPLETE_DATA);
    } else {
      // 編輯或刪除：混合模板和產品資料
      setTempleteProduct({
        ...INITIAL_TEMPLETE_DATA,
        ...product,
        imagesUrl: Array.isArray(product.imagesUrl)
          ? [...product.imagesUrl]
          : [],
      });
    }
    productModalRef.current.show();
  }

  return (
    <div className="col-md">
      <h2>產品列表</h2>
      {/* 新增產品按鈕 */}
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => openModal(INITIAL_TEMPLETE_DATA, "create")}
        >
          建立新的產品
        </button>
      </div>
      {/* 產品表格 */}
      <table className="table">
        <thead>
          <tr>
            <th>分類</th>
            <th>產品名稱</th>
            <th>原價</th>
            <th>售價</th>
            <th>是否啟用</th>
            <th>大小</th>
            <th>編輯</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.category}</td>
              <td>{product.title}</td>
              <td>{product.origin_price}</td>
              <td>{product.price}</td>
              <td className={`${product.is_enabled && "text-success"}`}>
                {product.is_enabled ? "啟用" : "未啟用"}
              </td>
              <td>{product.size}</td>
              <td>
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Basic example"
                >
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => openModal(product, "edit")}
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => openModal(product, "delete")}
                  >
                    刪除
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 產品Modal */}
      <ProductModal
        templeteProduct={templeteProduct}
        setTempleteProduct={setTempleteProduct}
        onUpdateProduct={onUpdateProduct}
        onDeleteProduct={onDeleteProduct}
        productModalRef={productModalRef}
        modalAction={modalAction}
      />
      <Pagination pagination={pagination} onPageChange={getProducts} />
    </div>
  );
}
