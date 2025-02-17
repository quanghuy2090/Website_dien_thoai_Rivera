import React, { useEffect, useState } from 'react';
import { getProductById, Product } from '../services/product';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [products, setProducts] = useState<Product | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await getProductById(id!);
      console.log(data);
      setProducts(data.data);
    })();
  }, [id]);

  return (
    <div className="product-detail">
      <div className="product-images">
        <div className="thumbnail-images">
          {products?.images.slice(1, 5).map((img, index) => (
            <div key={index} className="thumbnail-container">
              <img src={img} alt={`Thumbnail ${index + 1}`} />
            </div>
          ))}
        </div>

        <div className="main-image">
          <img src={products?.images[0]} alt="Main Product" />
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
