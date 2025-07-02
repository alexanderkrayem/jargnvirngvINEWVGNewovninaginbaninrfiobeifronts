import React, { useState, useEffect } from 'react';
import { User, MapPin, GraduationCap, Calendar } from 'lucide-react';
import { authorsApi } from '../../lib/api';

interface AuthorCardProps {
  authorName: string;
  className?: string;
}

interface AuthorInfo {
  name: string;
  bio: string;
  image: string;
  specialization: string;
  experience_years: number;
  education: string;
  location: string;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ authorName, className = '' }) => {
  const [author, setAuthor] = useState<AuthorInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true);
        const authorData = await authorsApi.getByName(authorName);
        setAuthor(authorData);
      } catch (error) {
        console.error('Error fetching author:', error);
        // Set default author info
        setAuthor({
          name: authorName,
          bio: 'طبيب أسنان متخصص ومؤلف في مجال طب الأسنان',
          image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          specialization: 'طب الأسنان العام',
          experience_years: 5,
          education: 'بكالوريوس طب وجراحة الأسنان',
          location: 'المملكة العربية السعودية'
        });
      } finally {
        setLoading(false);
      }
    };

    if (authorName) {
      fetchAuthor();
    }
  }, [authorName]);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-300 rounded"></div>
            <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-r-4 border-[#005CB9] ${className}`}>
      <div className="flex items-start space-x-4 space-x-reverse">
        <img
          src={author.image}
          alt={author.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
        />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{author.name}</h3>
          <p className="text-sm text-[#005CB9] font-medium mb-2">{author.specialization}</p>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">{author.bio}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="flex items-center">
              <GraduationCap size={12} className="ml-1" />
              <span>{author.education}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={12} className="ml-1" />
              <span>{author.experience_years} سنوات خبرة</span>
            </div>
            <div className="flex items-center md:col-span-2">
              <MapPin size={12} className="ml-1" />
              <span>{author.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;