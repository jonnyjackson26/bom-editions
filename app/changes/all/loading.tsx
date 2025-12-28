import TopBar from '@/components/TopBar';
import Link from 'next/link';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/changes" className="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-block">
            ← Back to Changes Overview
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            All Changes Across Editions
          </h1>
        </div>
        
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 mb-2">Loading all changes...</p>
            <p className="text-sm text-gray-500">Analyzing all editions, this may take a moment</p>
          </div>
        </div>
      </main>
    </div>
  );
}
