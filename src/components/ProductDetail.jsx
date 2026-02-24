export default function ProductDetail({
  product,
  products,
  tempImgUrl,
  setTempImgUrl,
}) {
  if (!product) {
    return <div className="col-md-6 text-secondary">請選擇一個商品查看</div>;
  }
  if (products.length === 0) {
    return <div className="col-md-6 text-secondary">無任何產品資料</div>;
  }
  //allImages:合併Url
  const allImages = product ? [product.imageUrl, ...product.imagesUrl] : [];

  return (
    <div className="col-md-6">
      <h2>單一產品細節</h2>

      <div className="card mb-3">
        <img src={tempImgUrl} className="card-img-top" alt={product.title} />

        <div className="card-body">
          <h5 className="card-title">
            {product.title}
            <span className="badge bg-primary ms-2">{product.category}</span>
          </h5>

          <p>{product.description}</p>
          <p>{product.content}</p>

          <div className="d-flex">
            <del className="text-secondary">{product.origin_price}</del>
            <span className="ms-2">{product.price} 元</span>
          </div>

          <h5 className="mt-3">更多圖片：</h5>
          <div className="d-flex flex-wrap">
            {allImages
              .filter((img) => img !== tempImgUrl)
              .map((url, i) => (
                <img
                  key={i}
                  src={url}
                  className="img-thumbnail me-2"
                  style={{
                    width: 60,
                    height: 60,
                    cursor: "pointer",
                  }}
                  onClick={() => setTempImgUrl(url)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
