import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const PageLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 max-w-7xl mx-auto">
          {title && (
            <div className="mb-6 flex items-center border-b border-secondary-100 pb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 tracking-tight">{title}</h1>
            </div>
          )}
          <div className="animate-fadeIn space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout; 