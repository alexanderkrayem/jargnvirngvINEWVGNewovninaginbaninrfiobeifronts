import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, ChevronRight, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import ArticleCard from '../components/article/ArticleCard';
import { articlesApi } from '../lib/api';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        
        if (!id) return;
        
        const data = await articlesApi.getById(id);
        setArticle(data);

        // Fetch related articles
        try {
          const relatedData = await articlesApi.getRelated(id, 3);
          setRelatedArticles(relatedData || []);
        } catch (error) {
          console.error('Error fetching related articles:', error);
          setRelatedArticles([]);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-80 bg-gray-300 rounded-lg mb-8"></div>
            <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">المقال غير موجود</h1>
          <p className="text-gray-600 mb-6">
            عذراً، المقال الذي تبحث عنه غير موجود أو تم نقله.
          </p>
          <Link
            to="/articles"
            className="bg-[#005CB9] hover:bg-[#0047A0] text-white px-6 py-3 rounded-md transition-colors inline-flex items-center"
          >
            <ChevronRight size={18} className="ml-1" />
            العودة إلى المقالات
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = format(
    new Date(article.publication_date),
    'dd MMMM yyyy',
    { locale: ar }
  );

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex mb-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-[#005CB9]">الرئيسية</Link>
            <span className="mx-2">/</span>
            <Link to="/articles" className="hover:text-[#005CB9]">المقالات</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{article.title}</span>
          </nav>

          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center text-gray-600 gap-x-6 gap-y-2">
              <div className="flex items-center">
                <User size={16} className="ml-1" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="ml-1" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string, index: number) => (
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
            </div>
          </div>

          {/* Article Cover Image */}
          <div className="mb-8">
            <img 
              src={article.cover_image} 
              alt={article.title}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>

          {/* Article Content */}
          <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="font-bold text-xl mb-4">{article.excerpt}</p>
              
              {/* Render the actual content from the article */}
              <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }} />
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-r-4 border-[#005CB9] pr-4">
                مقالات ذات صلة
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <ArticleCard key={relatedArticle.id} article={relatedArticle} />
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Link
              to="/articles"
              className="flex items-center text-[#005CB9] hover:text-[#0047A0] font-medium transition-colors"
            >
              <ChevronRight size={20} className="ml-1" />
              العودة إلى المقالات
            </Link>
            
            <Link
              to={relatedArticles.length > 0 ? `/articles/${relatedArticles[0].id}` : '/articles'}
              className="flex items-center text-[#005CB9] hover:text-[#0047A0] font-medium transition-colors"
            >
              المقال التالي
              <ChevronLeft size={20} className="mr-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;