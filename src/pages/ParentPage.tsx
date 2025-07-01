import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import ArticleList from '../components/article/ArticleList';

const ParentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <Navbar onSearch={setSearchTerm} />
      <ArticleList searchTerm={searchTerm} />
    </>
  );
};

export default ParentPage;
