import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 pt-12 pb-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* About */}
        <div>
          <h3 className="text-lg font-semibold text-green-700 mb-4">About Ecoloop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-green-600">Who We Are</Link></li>
            <li><Link to="/mission" className="hover:text-green-600">Our Mission</Link></li>
            <li><Link to="/careers" className="hover:text-green-600">Careers</Link></li>
            <li><Link to="/blog" className="hover:text-green-600">Blog</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-green-700 mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/help" className="hover:text-green-600">Help Center</Link></li>
            <li><Link to="/returns" className="hover:text-green-600">Returns & Refunds</Link></li>
            <li><Link to="/faq" className="hover:text-green-600">FAQs</Link></li>
            <li><Link to="/shipping" className="hover:text-green-600">Shipping Info</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-green-700 mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: <a href="mailto:support@repack.com" className="hover:text-green-600">support@repack.com</a></li>
            <li>Phone: <span className="text-gray-800">+91 98765 43210</span></li>
            <li>Address: <br /> 123 Green Street,<br /> New Delhi, India</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-green-700 mb-4">Follow Us</h3>
          <div className="flex gap-4 text-xl text-green-700">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="mailto:support@repack.com" aria-label="Email"><FaEnvelope /></a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-gray-500 border-t border-gray-300 pt-4">
        © 2025 RePack. All rights reserved. | Built with 💚 for the planet.
      </div>
    </footer>
  );
}
