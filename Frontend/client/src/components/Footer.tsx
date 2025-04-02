import { useEffect, useState } from "react";
import { getCategories, Category } from "../services/category"; // Adjust the import path as necessary
import { Link } from "react-router-dom";

export function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.data); // Adjust based on your API response structure
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      {/* FOOTER */}
      <footer id="footer">
        {/* top footer */}
        <div className="section">
          <div className="container">
            <div className="row">
              <div className="col-md-3 col-xs-6">
                <div className="footer">
                  <h3 className="footer-title">Về chúng tôi</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.</p>
                  <ul className="footer-links">
                    <li>
                      <a href="#"><i className="fa fa-map-marker" />Trịnh Văn Bô, Nam Từ Liêm, Hà Nội</a>
                    </li>
                    <li>
                      <a href="#"><i className="fa fa-phone" />+8494 5533 843</a>
                    </li>
                    <li>
                      <a href="#"><i className="fa fa-envelope-o" />email@email.com</a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-md-3 col-xs-6">
                <div className="footer">
                  <h3 className="footer-title">Thương hiệu</h3>
                  <ul className="footer-links">
                    {categories.map(category => (
                      <li key={category._id}>
                        <Link to={`/category/${category.slug}`}>{category.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="clearfix visible-xs" />
              <div className="col-md-3 col-xs-6">
                <div className="footer">
                  <h3 className="footer-title">Thông tin</h3>
                  <ul className="footer-links">
                    <li><a href="#">Về chúng tôi</a></li>
                    <li><a href="#">Liên hệ</a></li>
                    <li><a href="#">Chính sách riêng tư</a></li>
                    <li><a href="#">Chính sách hoàn trả</a></li>
                    <li><a href="#">Điều khoản dịch vụ</a></li>
                  </ul>
                </div>
              </div>

              <div className="col-md-3 col-xs-6">
                <div className="footer">
                  <h3 className="footer-title">Hỗ trợ</h3>
                  <ul className="footer-links">
                    <li><a href="/profile">Tài khoản</a></li>
                    <li><a href="/cart">Giỏ hàng</a></li>
                    <li><a href="/history">Lịch sử đơn hàng</a></li>
                    <li><a href="#">Trợ giúp</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom footer */}
        <div id="bottom-footer" className="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <ul className="footer-payments">
                  <li><a href="#"><i className="fa fa-cc-visa" /></a></li>
                  <li><a href="#"><i className="fa fa-credit-card" /></a></li>
                  <li><a href="#"><i className="fa fa-cc-paypal" /></a></li>
                  <li><a href="#"><i className="fa fa-cc-mastercard" /></a></li>
                  <li><a href="#"><i className="fa fa-cc-discover" /></a></li>
                  <li><a href="#"><i className="fa fa-cc-amex" /></a></li>
                </ul>
                <span className="copyright">
                  Copyright © All rights reserved | This template is made with
                  <i className="fa fa-heart-o" aria-hidden="true" /> by
                  <a href="https://colorlib.com" target="_blank">Colorlib</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* /FOOTER */}
    </>
  );
}