import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#003B78] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">طب الأسنان العربي</h3>
            <p className="mb-4 text-gray-300">
              منصة رائدة في مجال طب الأسنان العربي، نقدم أحدث المقالات والأبحاث العلمية للمتخصصين والمهتمين.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="hover:text-blue-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-300 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-blue-300 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-blue-300 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-blue-300 transition-colors">الرئيسية</Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-blue-300 transition-colors">المقالات</Link>
              </li>
              <li>
                <Link to="/research-topics" className="hover:text-blue-300 transition-colors">أبحاث علمية</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-300 transition-colors">من نحن</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-300 transition-colors">اتصل بنا</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">المواضيع الشائعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/articles?tag=implants" className="hover:text-blue-300 transition-colors">زراعة الأسنان</Link>
              </li>
              <li>
                <Link to="/articles?tag=orthodontics" className="hover:text-blue-300 transition-colors">تقويم الأسنان</Link>
              </li>
              <li>
                <Link to="/articles?tag=cosmetic" className="hover:text-blue-300 transition-colors">طب الأسنان التجميلي</Link>
              </li>
              <li>
                <Link to="/articles?tag=pediatric" className="hover:text-blue-300 transition-colors">طب أسنان الأطفال</Link>
              </li>
              <li>
                <Link to="/articles?tag=periodontics" className="hover:text-blue-300 transition-colors">أمراض اللثة</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone size={18} className="ml-2" />
                <span>+966 12 345 6789</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="ml-2" />
                <span>info@arabdental.com</span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="ml-2 mt-1" />
                <span>الرياض، المملكة العربية السعودية، طريق الملك فهد، برج المملكة، الطابق 15</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} طب الأسنان العربي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;