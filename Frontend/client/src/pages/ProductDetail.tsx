import React, { useEffect, useState } from 'react';
import { getProductById, Product } from '../services/product';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [products, setProducts] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const { data } = await getProductById(id!);
      setProducts(data.data);
      setMainImage(data.data.images[0]);
    })();
  }, [id]);

  return (
    <div className="product-detail">
      <div className="product-images">
        <div className="thumbnail-images">
          {products?.images.map((img, index) => (
            <div key={index} className={`${img === mainImage}`} onClick={() => setMainImage(img)}>
              <img src={img} alt={`${index + 1}`} />
            </div>
          ))}
        </div>

        <div className="main-image">
          <img src={mainImage!} alt="" />
        </div>
      </div>

      <div className="product-info">
        <h2>{products?.name}</h2>
        <p className="product-price">{products?.price} VND</p>
        <p className="product-description">{products?.description}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
