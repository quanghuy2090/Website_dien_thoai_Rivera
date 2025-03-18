import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CategoryContext } from "../../../context/CategoryContext";

const ListDetailCategory = () => {
  const { id } = useParams();
  const { getDetailCategory, state } = useContext(CategoryContext);
  useEffect(() => {
    getDetailCategory(id!)
  }, []);
  return (
    <div className="content">
      <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
        <i className="fas fa-th-large me-2"></i> Chi Tiết Danh Mục
      </h1>
      <p className="mb-4 text-secondary">
        Đây là thông tin chi tiết của danh mục "
        <strong>{state.selectedCategory?.name}</strong>". Bạn có thể xem thông tin và
        quản lý danh mục<cite></cite> tại đây.
      </p>
      <div className="table-container">
        <table className="table">
          <tbody>
            {state.selectedCategory && (
              <>
                <tr>
                  <th>ID</th>
                  <td>{state.selectedCategory._id}</td>
                </tr>
                <tr>
                  <th>Categories</th>
                  <td>{state.selectedCategory.name}</td>
                </tr>
                <tr>
                  <th>Slug</th>
                  <td>{state.selectedCategory.slug}</td>
                </tr>
                <tr>
                  <th>Products</th>
                  <td>
                    {state.selectedCategory.products?.map((product) => (
                      <table key={product._id} className="table table-bordered">
                        <tbody>
                          <tr>
                            <th>Product ID</th>
                            <td>{product._id}</td>
                          </tr>
                          <tr>
                            <th>Product Name</th>
                            <td>{product.name}</td>
                          </tr>
                          <tr>
                            <th>Short Description</th>
                            <td>{product.short_description}</td>
                          </tr>
                          <tr>
                            <th>Long Description</th>
                            <td>{product.long_description}</td>
                          </tr>
                          <tr>
                            <th>Images</th>
                            <td>
                              {product.images.map((image, index) => (
                                <img key={index} src={image} alt="product" style={{ width: "50px", height: "50px", marginRight: "5px" }} />
                              ))}
                            </td>
                          </tr>
                          <tr>
                            <th>Variants</th>
                            <td>
                              {product.variants.length > 0 ? (
                                <table className="table table-bordered">
                                  <tbody>
                                    {product.variants.map((variant, index) => (
                                      <tr key={index}>
                                        <th>Color</th>
                                        <td>{variant.color && typeof variant.color === "object" ? variant.color.name : variant.color ?? "Không xác định"}</td>
                                        <th>Capacity</th>
                                        <td>{variant.capacity && typeof variant.capacity === "object" ? variant.capacity.value : variant.capacity ?? "Không xác định"} </td>
                                        <th>Price</th>
                                        <td>{variant.price}</td>
                                        <th>Stock</th>
                                        <td>{variant.stock}</td>
                                        <th>SKU</th>
                                        <td>{variant.sku}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                "No Variants"
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ))}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default ListDetailCategory;
