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
    <div className="content p-4">
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-0">  Đây là thông tin chi tiết của danh mục <strong>{state.selectedCategory?.name}</strong></h5>
          <span className="text-primary">Bảng / Danh mục sản phẩm</span>
        </div>
        <table className="table table-hover">
          <tbody>
            {state.selectedCategory && (
              <>
                <tr>
                  <th>ID</th>
                  <td>{state.selectedCategory._id}</td>
                </tr>
                <tr>
                  <th>Danh mục</th>
                  <td>{state.selectedCategory.name}</td>
                </tr>
                <tr>
                  <th>Mô tả</th>
                  <td>{state.selectedCategory.slug}</td>
                </tr>
                {/* <tr>
                  <th>Người thực hiện </th>
                  <td>{state.selectedCategory.deletedBy.email}</td>
                </tr> */}
                <tr>
                  <th>Ngày tạo</th>
                  <td>{new Date(state.selectedCategory.createdAt).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <th>Cập nhật lần cuối</th>
                  <td> {new Date(state.selectedCategory.updatedAt).toLocaleString()}</td>
                </tr>
                <tr>
                  <th>Sản phẩm danh mục</th>
                  <td>
                    {state.selectedCategory.products?.map((product) => (
                      <table key={product._id} className="table table-bordered">
                        <tbody>
                          <tr>
                            <th> Id Sản Phẩm</th>
                            <td>{product._id}</td>
                          </tr>
                          <tr>
                            <th>Sản phẩm</th>
                            <td>{product.name}</td>
                          </tr>
                          {/* <tr>
                            <th>Short Description</th>
                            <td>{product.short_description}</td>
                          </tr>
                          <tr>
                            <th>Long Description</th>
                            <td>{product.long_description}</td>
                          </tr> */}
                          <tr>
                            <th>Ảnh</th>
                            <td>
                              {product.images.map((image, index) => (
                                <img key={index} src={image} alt="product" style={{ width: "50px", height: "50px", marginRight: "5px" }} />
                              ))}
                            </td>
                          </tr>
                          <tr>
                            <th>Biến thể</th>
                            <td>
                              {product.variants.length > 0 ? (
                                <table className="table table-bordered">
                                  <thead className="table-light">

                                    <tr>
                                      <th>Thuộc tính</th>
                                      {product.variants.map((_, index) => (
                                        <th key={index}>Biến thể {index + 1}</th>
                                      ))}
                                    </tr>

                                  </thead>
                                  <tbody>
                                    <tr>
                                      <th>Màu sắc</th>
                                      {product.variants.map((variant, index) => (
                                        <td key={index}>
                                          {variant.color && typeof variant.color === "object"
                                            ? variant.color.name
                                            : variant.color ?? "Không xác định"}
                                        </td>
                                      ))}
                                    </tr>
                                    <tr>
                                      <th>Bộ nhớ</th>
                                      {product.variants.map((variant, index) => (
                                        <td key={index}>
                                          {variant.capacity && typeof variant.capacity === "object"
                                            ? variant.capacity.value
                                            : variant.capacity ?? "Không xác định"}
                                        </td>
                                      ))}
                                    </tr>
                                    <tr>
                                      <th>Giá</th>
                                      {product.variants.map((variant, index) => (
                                        <td key={index}>{variant.price}</td>
                                      ))}
                                    </tr>
                                    <tr>
                                      <th>Số lượng</th>
                                      {product.variants.map((variant, index) => (
                                        <td key={index}>{variant.stock}</td>
                                      ))}
                                    </tr>
                                    <tr>
                                      <th>SKU</th>
                                      {product.variants.map((variant, index) => (
                                        <td key={index}>{variant.sku}</td>
                                      ))}
                                    </tr>
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
