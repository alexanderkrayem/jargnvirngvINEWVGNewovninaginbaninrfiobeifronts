import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Search, Filter, X, Loader } from 'lucide-react';
import ResearchCard from '../components/research/ResearchCard';
import { researchApi } from '../lib/api';

const ResearchTopicsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [researches, setResearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedJournals, setSelectedJournals] = useState<string[]>([]);
  const [availableJournals, setAvailableJournals] = useState<string[]>([]);
  const [showJournalFilter, setShowJournalFilter] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchResearches = async () => {
      try {
        setLoading(true);
        
        const params: any = {};
        
        if (selectedJournals.length > 0) {
          params.journal = selectedJournals[0];
        }
        
        if (searchTerm) {
          params.search = searchTerm;
        }

        console.log('Fetching research with params:', params);
        const response = await researchApi.getAll(params);
        console.log('Research response:', response);
        
        const researchData = response.data || response || [];
        setResearches(researchData);
        setTotalResults(response.pagination?.total || researchData.length);

        // Fetch available journals
        try {
          const journals = await researchApi.getJournals();
          setAvailableJournals(journals || []);
        } catch (error) {
          console.error('Error fetching journals:', error);
        }
      } catch (error) {
        console.error('Error fetching researches:', error);
        setResearches([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    fetchResearches();
  }, [searchTerm, selectedJournals]);

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    if (selectedJournals.length > 0) {
      params.set('journal', selectedJournals[0]);
    }
    setSearchParams(params);
  }, [searchTerm, selectedJournals, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleJournal = (journal: string) => {
    setSelectedJournals(prev => 
      prev.includes(journal) 
        ? prev.filter(j => j !== journal) 
        : [journal] // Only allow one journal for now
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedJournals([]);
    setSearchParams({});
  };

  const toggleJournalFilter = () => {
    setShowJournalFilter(!showJournalFilter);
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            الأبحاث العلمية
          </h1>
          <p className="text-gray-600 text-lg">
            استكشف أحدث الأبحاث والدراسات العلمية في مجال طب الأسنان من أشهر المجلات والدوريات العلمية.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="ابحث في الأبحاث العلمية..."
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005CB9] focus:border-transparent"
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
                onClick={toggleJournalFilter}
                className={`flex items-center justify-center px-4 py-3 rounded-lg transition-colors ${
                  showJournalFilter ? 'bg-[#005CB9] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Filter size={18} className="ml-2" />
                <span>تصفية حسب المجلة</span>
              </button>
              {(searchTerm || selectedJournals.length > 0) && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="flex items-center justify-center px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                >
                  <X size={18} className="ml-2" />
                  <span>مسح</span>
                </button>
              )}
            </div>
          </form>

          {/* Active filters display */}
          {(searchTerm || selectedJournals.length > 0) && (
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
              {selectedJournals.map((journal) => (
                <span
                  key={journal}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  المجلة: {journal}
                  <button
                    onClick={() => toggleJournal(journal)}
                    className="mr-2 text-green-600 hover:text-green-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {showJournalFilter && availableJournals.length > 0 && (
            <div className="mt-4 animate-fadeIn">
              <h4 className="text-sm font-medium text-gray-700 mb-2">تصفية حسب المجلة:</h4>
              <div className="flex flex-wrap gap-2">
                {availableJournals.map((journal) => (
                  <button
                    key={journal}
                    onClick={() => toggleJournal(journal)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedJournals.includes(journal)
                        ? 'bg-[#005CB9] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {journal}
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
              `تم العثور على ${totalResults} بحث${totalResults !== 1 ? '' : ''}`
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-4xl font-bold text-[#005CB9] mb-2">{totalResults}</div>
            <p className="text-gray-600">بحث علمي</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-4xl font-bold text-[#005CB9] mb-2">{availableJournals.length}</div>
            <p className="text-gray-600">مجلة علمية</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-4xl font-bold text-[#005CB9] mb-2">24</div>
            <p className="text-gray-600">تخصص طبي</p>
          </div>
        </div>

        {/* Research List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : researches.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد أبحاث متطابقة</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedJournals.length > 0 
                ? 'لم نتمكن من العثور على أبحاث تطابق معايير البحث. جرب كلمات مختلفة أو امسح المرشحات.'
                : 'لا توجد أبحاث متاحة حالياً.'
              }
            </p>
            {(searchTerm || selectedJournals.length > 0) && (
              <button
                onClick={clearSearch}
                className="bg-[#005CB9] hover:bg-[#0047A0] text-white px-6 py-2 rounded-md transition-colors"
              >
                مسح المرشحات
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researches.map((research) => (
              <ResearchCard key={research.id} research={research} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchTopicsPage;