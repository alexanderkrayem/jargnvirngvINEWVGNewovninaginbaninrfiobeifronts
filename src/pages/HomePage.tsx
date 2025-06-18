import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, FileText } from 'lucide-react';
import FeaturedArticles from '../components/article/FeaturedArticles';
import ArticleList from '../components/article/ArticleList';
import { articlesApi } from '../lib/api';

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Get articles to extract unique tags
        const response = await articlesApi.getAll({ limit: 100 });
        const articles = response.data || response || [];
        
        if (articles.length > 0) {
          const allTags = articles.flatMap((article: any) => article.tags);
          const uniqueTags = [...new Set(allTags)];
          const categoriesWithImages = uniqueTags.slice(0, 6).map((tag) => ({
            id: tag,
            name: tag,
            image: `https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`
          }));
          setCategories(categoriesWithImages);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#005CB9] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">منصة طب الأسنان العربي</h1>
            <p className="text-xl mb-8">موسوعة متكاملة من المقالات والأبحاث العلمية في مجال طب الأسنان</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/articles" 
                className="bg-white text-[#005CB9] hover:bg-gray-100 transition-colors py-3 px-6 rounded-md font-medium flex items-center justify-center"
              >
                <BookOpen size={20} className="ml-2" />
                تصفح المقالات
              </Link>
              <Link 
                to="/research-topics" 
                className="bg-transparent border-2 border-white hover:bg-white/10 transition-colors py-3 px-6 rounded-md font-medium flex items-center justify-center"
              >
                <FileText size={20} className="ml-2" />
                استكشف الأبحاث
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Carousel */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-r-4 border-[#005CB9] pr-4">مقالات مميزة</h2>
          <FeaturedArticles />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-r-4 border-[#005CB9] pr-4">التخصصات الطبية</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id}
                to={`/articles?tag=${category.id}`}
                className="group relative overflow-hidden rounded-lg shadow-md h-48"
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                  <div className="p-6 w-full">
                    <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                    <div className="flex items-center text-white/80 group-hover:text-white transition-colors">
                      <span className="text-sm">تصفح المقالات</span>
                      <ArrowLeft size={16} className="mr-1 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 border-r-4 border-[#005CB9] pr-4">أحدث المقالات</h2>
            <Link 
              to="/articles" 
              className="text-[#005CB9] hover:text-[#0047A0] transition-colors font-medium flex items-center"
            >
              عرض جميع المقالات
              <ArrowLeft size={16} className="mr-1" />
            </Link>
          </div>
          
          <ArticleList limit={6} showFilters={false} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-[#003B78] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">انضم إلى نشرتنا البريدية</h2>
            <p className="text-lg mb-8 text-gray-300">احصل على أحدث المقالات والأبحاث في مجال طب الأسنان مباشرة في بريدك الإلكتروني</p>
            
            <form className="flex flex-col md:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                className="px-4 py-3 rounded-md flex-grow max-w-md text-right text-gray-800"
                required
              />
              <button 
                type="submit" 
                className="bg-[#005CB9] hover:bg-[#0047A0] transition-colors px-6 py-3 rounded-md font-medium"
              >
                اشترك الآن
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;