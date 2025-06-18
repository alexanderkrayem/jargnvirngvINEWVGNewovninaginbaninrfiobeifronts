import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter } from 'lucide-react';
import ResearchCard from '../components/research/ResearchCard';
import { researchApi } from '../lib/api';

const ResearchTopicsPage: React.FC = () => {
  const [researches, setResearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJournals, setSelectedJournals] = useState<string[]>([]);
  const [availableJournals, setAvailableJournals] = useState<string[]>([]);
  const [showJournalFilter, setShowJournalFilter] = useState(false);

  useEffect(() => {
    const fetchResearches = async () => {
      try {
        setLoading(true);
        
        const params: any = {};
        
        if (selectedJournals.length > 0) {
          params.journal = selectedJournals[0]; // Backend expects single journal for now
        }
        
        if (searchTerm) {
          params.search = searchTerm;
        }

        const response = await researchApi.getAll(params);
        setResearches(response.data || response || []);

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
      } finally {
        setLoading(false);
      }
    };

    fetchResearches();
  }, [searchTerm, selectedJournals]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const toggleJournal = (journal: string) => {
    setSelectedJournals(prev => 
      prev.includes(journal) 
        ? prev.filter(j => j !== journal) 
        : [journal] // Only allow one journal for now
    );
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
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005CB9]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            </div>
            <button
              type="button"
              onClick={toggleJournalFilter}
              className="flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter size={18} className="ml-2" />
              <span>تصفية حسب المجلة</span>
            </button>
          </form>

          {showJournalFilter && (
            <div className="mt-4 flex flex-wrap gap-2 animate-fadeIn">
              {availableJournals.map((journal) => (
                <button
                  key={journal}
                  onClick={() => toggleJournal(journal)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedJournals.includes(journal)
                      ? 'bg-[#005CB9] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {journal}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-4xl font-bold text-[#005CB9] mb-2">{researches.length}</div>
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
            <p className="text-gray-600">
              لم نتمكن من العثور على أبحاث تطابق معايير البحث. يرجى تعديل المعايير والمحاولة مرة أخرى.
            </p>
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