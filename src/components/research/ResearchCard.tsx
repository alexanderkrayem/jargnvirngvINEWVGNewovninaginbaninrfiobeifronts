import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ResearchCardProps {
  research: {
    id: string;
    title: string;
    abstract: string;
    publication_date: string;
    authors: string[];
    file_url: string;
    journal: string;
  };
}

const ResearchCard: React.FC<ResearchCardProps> = ({ research }) => {
  const formattedDate = format(
    new Date(research.publication_date),
    'dd MMMM yyyy',
    { locale: ar }
  );

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800 hover:text-[#005CB9] transition-colors">
            <Link to={`/research/${research.id}`}>{research.title}</Link>
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
            بحث علمي
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{research.abstract}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {research.authors.map((author, index) => (
            <span key={index} className="text-sm text-gray-500">
              {author}{index < research.authors.length - 1 ? '، ' : ''}
            </span>
          ))}
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar size={16} className="ml-1" />
          <span>{formattedDate}</span>
          <span className="mx-2">•</span>
          <span>{research.journal}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/research/${research.id}`}
            className="text-[#005CB9] hover:text-[#0047A0] transition-colors font-medium"
          >
            قراءة المزيد
          </Link>
          
          <a 
            href={research.file_url}
            download
            className="flex items-center bg-[#005CB9] hover:bg-[#0047A0] text-white px-3 py-1.5 rounded-md transition-colors"
          >
            <Download size={16} className="ml-1" />
            تحميل البحث
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResearchCard;