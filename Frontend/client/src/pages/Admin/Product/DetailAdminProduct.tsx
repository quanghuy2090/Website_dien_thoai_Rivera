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
      <div className="col-md-10 ms-sm-auto px-md-4 mt-4 ">
        <table className="table table-striped table-bordered">
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
              <td>{productDetail?.price}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{productDetail?.description}</td>
            </tr>
            <tr>
              <th>Stock</th>
              <td>{productDetail?.stock}</td>
            </tr>
            <tr>
              <th>Color</th>
              <td>{productDetail?.color}</td>
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailAdminProduct;
