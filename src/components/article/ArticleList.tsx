import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ArticleCard from './ArticleCard';
import { articlesApi } from '../../lib/api';
import { Search, Filter, X, Loader } from 'lucide-react';

interface ArticleListProps {
  tag?: string;
  limit?: number;
  showFilters?: boolean;
}

const ArticleList: React.FC<ArticleListProps> = ({ tag, limit = 12, showFilters = true }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(tag ? [tag] : []);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        
        const params: any = { limit };
        
        if (selectedTags.length > 0) {
          params.tag = selectedTags[0];
        }
        
        if (searchTerm) {
          params.search = searchTerm;
        }

        console.log('Fetching articles with params:', params);
        const response = await articlesApi.getAll(params);
        console.log('Articles response:', response);
        
        const articlesData = response.data || response || [];
        setArticles(articlesData);
        setTotalResults(response.pagination?.total || articlesData.length);

        // Extract unique tags from all articles for filtering - FIX TYPE ISSUE
        if (articlesData.length > 0) {
          const allTags = articlesData.flatMap((article: any) => {
            // Ensure tags is an array and contains only strings
            if (Array.isArray(article.tags)) {
              return article.tags.filter((tag: any): tag is string => typeof tag === 'string');
            }
            return [];
          });
          const uniqueTags = [...new Set(allTags)] as string[];
          setAvailableTags(uniqueTags);
        } else {
          setAvailableTags([]);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles([]);
        setTotalResults(0);
        setAvailableTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [searchTerm, selectedTags, tag, limit]);

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    if (selectedTags.length > 0) {
      params.set('tag', selectedTags[0]);
    }
    setSearchParams(params);
  }, [searchTerm, selectedTags, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName) 
        : [tagName] // Only allow one tag for now
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSearchParams({});
  };

  const toggleTagFilter = () => {
    setShowTagFilter(!showTagFilter);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </div>
        )}
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
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005CB9] focus:border-transparent"
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleTagFilter}
                className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                  showTagFilter ? 'bg-[#005CB9] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Filter size={18} className="ml-2" />
                <span>تصفية</span>
              </button>
              {(searchTerm || selectedTags.length > 0) && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="flex items-center justify-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                >
                  <X size={18} className="ml-2" />
                  <span>مسح</span>
                </button>
              )}
            </div>
          </form>

          {/* Active filters display */}
          {(searchTerm || selectedTags.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  البحث: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mr-2 text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  الموضوع: {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="mr-2 text-green-600 hover:text-green-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {showTagFilter && availableTags.length > 0 && (
            <div className="mt-4 animate-fadeIn">
              <h4 className="text-sm font-medium text-gray-700 mb-2">تصفية حسب الموضوع:</h4>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tagName) => (
                  <button
                    key={tagName}
                    onClick={() => toggleTag(tagName)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tagName)
                        ? 'bg-[#005CB9] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tagName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results counter */}
          <div className="mt-4 text-sm text-gray-600">
            {loading ? (
              <div className="flex items-center">
                <Loader className="animate-spin ml-2" size={16} />
                جاري البحث...
              </div>
            ) : (
              `تم العثور على ${totalResults} مقال${totalResults !== 1 ? '' : ''}`
            )}
          </div>
        </div>
      )}

      {articles.length === 0 && !loading ? (
        <div className="text-center py-12">
          <Search size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد مقالات</h3>
          <p className="text-gray-600">
            {searchTerm || selectedTags.length > 0 
              ? 'لم نتمكن من العثور على مقالات تطابق معايير البحث. جرب كلمات مختلفة أو امسح المرشحات.'
              : 'لا توجد مقالات متاحة حالياً.'
            }
          </p>
          {(searchTerm || selectedTags.length > 0) && (
            <button
              onClick={clearSearch}
              className="mt-4 bg-[#005CB9] hover:bg-[#0047A0] text-white px-6 py-2 rounded-md transition-colors"
            >
              مسح المرشحات
            </button>
          )}
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