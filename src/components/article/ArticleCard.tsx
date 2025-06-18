import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Tag } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    cover_image: string;
    publication_date: string;
    author: string;
    tags: string[];
  };
  featured?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
  const formattedDate = formatDistance(
    new Date(article.publication_date),
    new Date(),
    { addSuffix: true, locale: ar }
  );

  if (featured) {
    return (
      <div className="relative overflow-hidden rounded-lg shadow-lg group transition-all duration-300 hover:shadow-xl">
        <div className="relative h-96">
          <img 
            src={article.cover_image} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <span className="inline-block bg-[#005CB9] text-white text-sm font-medium px-3 py-1 rounded-full mb-3">
              مقال مميز
            </span>
            <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
            <p className="mb-3 text-gray-200 line-clamp-2">{article.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-300">
                <Clock size={16} className="ml-1" />
                <span>{formattedDate}</span>
              </div>
              <Link 
                to={`/articles/${article.id}`}
                className="text-white bg-[#0047A0] hover:bg-[#003B78] transition py-2 px-4 rounded-md"
              >
                اقرأ المزيد
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link to={`/articles/${article.id}`}>
        <img 
          src={article.cover_image} 
          alt={article.title} 
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {article.tags.slice(0, 2).map((tag, index) => (
            <Link 
              key={index} 
              to={`/articles?tag=${tag}`}
              className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              <Tag size={12} className="ml-1" />
              {tag}
            </Link>
          ))}
        </div>
        <Link to={`/articles/${article.id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-[#005CB9] transition-colors">
            {article.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{article.author}</span>
          <div className="flex items-center">
            <Clock size={14} className="ml-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;