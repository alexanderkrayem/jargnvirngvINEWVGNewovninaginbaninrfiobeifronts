import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ArticleList from '../components/article/ArticleList';

const ArticlesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tag = searchParams.get('tag') || undefined;

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
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
        
        <ArticleList tag={tag} limit={24} />
      </div>
    </div>
  );
};

export default ArticlesPage;