import React, { useEffect, useState } from "react";
import { getProductById, Product } from "../../../services/product";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const DetailAdminProduct = () => {
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState<Product | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await getProductById(id!);
      setProductDetail(data.data);
      toast.success("Product id successfully");
    })();
  }, []);
  return (
    <div>
      <div className="content">
        <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
          <i className="fas fa-cart-plus me-2"></i> Chi Tiết Sản Phẩm
        </h1>
        <p className="mb-4 text-secondary">
          Đây là thông tin chi tiết của sản phẩm "
          <strong>{productDetail?.name}</strong>". Bạn có thể xem thông tin và
          quản lý sản phẩm tại đây.
        </p>

        <div className="table-container">
          <table className="table table-bordered border-primary">
            <tbody>
              <tr>
                <th>Id</th>
                <td>{productDetail?._id}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{productDetail?.name}</td>
              </tr>
              <tr>
                <th>Price</th>
                <td>{productDetail?.short_description}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td>{productDetail?.long_description}</td>
              </tr>

              <tr>
                <th>Category name</th>
                <td>
                  {typeof productDetail?.categoryId === "object" &&
                  productDetail.categoryId !== null
                    ? productDetail?.categoryId.name
                    : productDetail?.categoryId}
                </td>
              </tr>
              <tr>
                <th>Product image</th>
                {productDetail?.images.map((image) => (
                  <img src={image} alt="" width={100} />
                ))}
              </tr>
              <tr>
                <th>Product variants</th>
                <td>
                  <table className="table table-bordered border-primary">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Giá</th>
                        <th>Bộ nhớ</th>
                        <th>Stock</th>
                        <th>Sku</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productDetail?.variants.map((variant, index) => (
                        <tr key={index}>
                          <td>{variant.color}</td>
                          <td>{variant.price}</td>
                          <td>{variant.capacity}</td>
                          <td>{variant.stock}</td>
                          <td>{variant.sku}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailAdminProduct;
