import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';  // Adjust the path if needed
import ArticleList from '../components/article/ArticleList';

const ArticlesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tag = searchParams.get('tag') || undefined;

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Pass onSearch to Navbar */}
      <Navbar onSearch={(query) => setSearchTerm(query)} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {tag ? `مقالات في ${tag}` : 'جميع المقالات'}
          </h1>
          <p className="text-gray-600 mt-2">
            {tag
              ? `تصفح أحدث المقالات والموضوعات المتعلقة بـ ${tag}`
              : 'تصفح أحدث المقالات والموضوعات في مجال طب الأسنان'
            }
          </p>
        </div>

        <ArticleList tag={tag} searchTerm={searchTerm} limit={24} />
      </div>
    </div>
  );
};

export default ArticlesPage;
