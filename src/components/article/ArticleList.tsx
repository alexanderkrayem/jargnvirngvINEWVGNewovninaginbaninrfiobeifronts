import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { articlesApi } from '../../lib/api';
import { Search, Filter } from 'lucide-react';

interface ArticleListProps {
  tag?: string;
  limit?: number;
  showFilters?: boolean;
}

const ArticleList: React.FC<ArticleListProps> = ({ tag, limit = 12, showFilters = true }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(tag ? [tag] : []);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);

useEffect(() => {
  const fetchArticles = async () => {
    try {
      setLoading(true);

      const params: any = { limit };

      if (selectedTags.length > 0) {
        params.tag = selectedTags[0]; // Backend expects single tag for now
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await articlesApi.getAll(params);
      setArticles(response.data || response || []);

      if (response.data || response) {
        const allTags = (response.data || response).flatMap((article: any) => {
          if (Array.isArray(article.tags)) {
            return article.tags.filter((tag: unknown): tag is string => typeof tag === "string");
          }
          return [];
        });
        const uniqueTags = Array.from(new Set(allTags)) as string[];
        setAvailableTags(uniqueTags);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  fetchArticles();
}, [searchTerm, selectedTags, tag, limit]);



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [tag] // Only allow one tag for now
    );
  };

  const toggleTagFilter = () => {
    setShowTagFilter(!showTagFilter);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-300 h-48 rounded-t-lg"></div>
            <div className="bg-white p-5 rounded-b-lg">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-3"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="ابحث عن مقالات..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005CB9]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            </div>
            <button
              type="button"
              onClick={toggleTagFilter}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter size={18} className="ml-2" />
              <span>تصفية حسب الموضوع</span>
            </button>
          </form>

          {showTagFilter && (
            <div className="mt-4 flex flex-wrap gap-2 animate-fadeIn">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-[#005CB9] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {articles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">لا توجد مقالات متاحة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleList;