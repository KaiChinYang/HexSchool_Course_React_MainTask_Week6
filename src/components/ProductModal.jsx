import api from "../api/axiosInstance"
export default function ProductModal({
  templeteProduct,
  setTempleteProduct,
  onUpdateProduct,
  productModalRef,
  onDeleteProduct,
  modalAction,
}) {
  function handleModalInputChage(e) {
    const { name, value, type, checked } = e.target;
    //是不是chekcbox
    const val = type === "checkbox" ? checked : value;
    setTempleteProduct((pre) => ({
      ...pre,
      [name]: val,
    }));
  }
  function handleModalImagesUrlChange(index, value) {
    setTempleteProduct((pre) => {
      const newImagesUrl = [...pre.imagesUrl];
      newImagesUrl[index] = value ?? ""; //防止uncontrolled to controlled
      //優化
      //假設最多五筆
      if (
        value !== "" &&
        index === newImagesUrl.length - 1 &&
        newImagesUrl.length < 5
      ) {
        newImagesUrl.push(undefined);
      }
      //不清除到沒有資料
      if (
        value === undefined &&
        newImagesUrl.length > 1 &&
        newImagesUrl[newImagesUrl.length - 1] === undefined
      ) {
        newImagesUrl.pop();
      }
      return { ...pre, imagesUrl: newImagesUrl };
    });
  }
  function handleModalAddImage() {
    setTempleteProduct((pre) => {
      const newImagesUrl = [...pre.imagesUrl];
      newImagesUrl.push(undefined);
      return { ...pre, imagesUrl: newImagesUrl };
    });
  }
  function handleModalDeleteImage() {
    setTempleteProduct((pre) => {
      const newImagesUrl = [...pre.imagesUrl];
      newImagesUrl.pop();
      return { ...pre, imagesUrl: newImagesUrl };
    });
  }
  function closeModal() {
    // setTempleteProduct(INITIAL_TEMPLETE_DATA);
    productModalRef.current.hide();
  }
  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("請選擇檔案");
      return;
    }
    try {
      //使用formData 上傳檔案
      const formData = new FormData();
      formData.append("file-to-upload", file);
      const res = await api.uploadImage(formData);
      console.log(res.data);
      setTempleteProduct((pre) => ({ ...pre, imageUrl: res.data.imageUrl }));
    } catch (error) {
      console.dir(error.response?.data.message);
      alert("圖片上傳失敗，請稍後再試");
    }
  };
  return (
    <div
      id="productModal"
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
      ref={productModalRef}
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div
            className={`modal-header ${modalAction === "delete" ? "bg-danger" : modalAction === "edit" ? "bg-primary" : "bg-dark"} text-white`}
          >
            <h5 id="productModalLabel" className="modal-title">
              <span>
                {modalAction === "delete"
                  ? "刪除"
                  : modalAction === "edit"
                    ? "編輯"
                    : "新增"}
                產品
              </span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {modalAction === "delete" ? (
              <p className="fs-4">
                <span className="text-danger">
                  確定刪除{templeteProduct.title}嗎?
                </span>
              </p>
            ) : (
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="fileUpload" className="form-label">
                        上傳圖片
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        name="fileUpload"
                        id="fileUpload"
                        accept=".jpeg,.jpg,.png"
                        onChange={(e) => uploadImage(e)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        value={templeteProduct.imageUrl}
                        onChange={(e) => handleModalInputChage(e)}
                      />
                    </div>
                    {templeteProduct.imageUrl && (
                      <img
                        className="img-fluid"
                        src={templeteProduct.imageUrl}
                        alt="主圖"
                      />
                    )}
                  </div>
                  <div>
                    {templeteProduct.imagesUrl.map((imgUrl, index) => (
                      <div key={index}>
                        <label htmlFor="imageUrl" className="form-label">
                          輸入圖片網址
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`圖片網址${index + 1}`}
                          value={imgUrl ?? ""} //防止uncontrolled to controlled
                          onChange={(e) =>
                            handleModalImagesUrlChange(index, e.target.value)
                          }
                        />
                        {
                          <img
                            className="img-fluid"
                            src={imgUrl}
                            alt={`副圖${index + 1}`}
                          />
                        }
                      </div>
                    ))}
                    {templeteProduct.imagesUrl.length < 5 &&
                      templeteProduct.imagesUrl[
                        templeteProduct.imagesUrl.length - 1
                      ] !== "" && (
                        <button
                          className="btn btn-outline-primary btn-sm d-block w-100"
                          onClick={() => handleModalAddImage()}
                        >
                          新增圖片
                        </button>
                      )}
                  </div>
                  <div>
                    {templeteProduct.imagesUrl.length >= 1 && (
                      <button
                        className="btn btn-outline-danger btn-sm d-block w-100"
                        onClick={() => handleModalDeleteImage()}
                      >
                        刪除圖片
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={templeteProduct.title}
                      onChange={(e) => handleModalInputChage(e)}
                      disabled={modalAction === "edit"}
                    />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="category" className="form-label">
                        分類
                      </label>
                      <input
                        name="category"
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        value={templeteProduct.category}
                        onChange={(e) => handleModalInputChage(e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">
                        單位
                      </label>
                      <input
                        name="unit"
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        value={templeteProduct.unit}
                        onChange={(e) => handleModalInputChage(e)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                        value={templeteProduct.origin_price}
                        onChange={(e) => handleModalInputChage(e)}
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        name="price"
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                        value={templeteProduct.price}
                        onChange={(e) => handleModalInputChage(e)}
                      />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                      value={templeteProduct.description}
                      onChange={(e) => handleModalInputChage(e)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      className="form-control"
                      placeholder="請輸入說明內容"
                      value={templeteProduct.content}
                      onChange={(e) => handleModalInputChage(e)}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        name="is_enabled"
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                        checked={templeteProduct.is_enabled}
                        onChange={(e) => handleModalInputChage(e)}
                      />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-check-label" htmlFor="size">
                      商品尺寸
                    </label>
                    <select
                      id="size"
                      name="size"
                      className="form-select"
                      aria-label="Default select example"
                      value={templeteProduct.size}
                      onChange={(e) => handleModalInputChage(e)}
                    >
                      <option value="">請選擇</option>
                      <option value="lg">大</option>
                      <option value="md">中</option>
                      <option value="sm">小</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            {modalAction === "delete" ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => onDeleteProduct(templeteProduct, closeModal)}
              >
                刪除
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => closeModal()}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    onUpdateProduct(templeteProduct, modalAction, closeModal)
                  }
                >
                  確認
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
