import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About - Book of Mormon Editions',
  description: 'Learn about the Book of Mormon Editions project and its mission to make historical editions accessible.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About This Project</h1>
          
          <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              The Book of Mormon Editions project aims to make historical editions of the Book of Mormon 
              easily accessible and comparable. We believe that understanding how sacred texts have evolved 
              over time provides valuable insights into their history and transmission.
            </p>
            <p className="text-gray-700">
              By presenting multiple editions side-by-side and highlighting changes, we enable scholars, 
              students, and curious readers to explore the textual history of the Book of Mormon in an 
              intuitive and meaningful way.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Editions</h2>
            <p className="text-gray-700 mb-4">
              This project includes the following editions of the Book of Mormon:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>1830</strong> - The original edition, published in Palmyra, New York</li>
              <li><strong>1837</strong> - First revision with numerous corrections</li>
              <li><strong>1840</strong> - Third edition with additional changes</li>
              <li><strong>1841</strong> - European edition published in Liverpool</li>
              <li><strong>1879</strong> - Edition with verse numbers added</li>
              <li><strong>1920</strong> - Edition with modernized language and formatting</li>
              <li><strong>1981</strong> - Major revision with updated introduction and footnotes</li>
              <li><strong>2013</strong> - Current edition with minor refinements</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
            <ul className="space-y-4 text-gray-700">
              <li>
                <strong className="text-gray-900">Read Any Edition:</strong> Browse and read any edition 
                of the Book of Mormon with a clean, distraction-free interface.
              </li>
              <li>
                <strong className="text-gray-900">Compare Editions:</strong> View two editions side-by-side 
                with changes highlighted inline, showing additions, deletions, and modifications.
              </li>
              <li>
                <strong className="text-gray-900">Footnotes:</strong> See how specific words or phrases 
                appear across all editions for detailed comparison.
              </li>
              <li>
                <strong className="text-gray-900">Simultaneous View:</strong> Read all editions simultaneously 
                in a multi-column layout for comprehensive comparison.
              </li>
              <li>
                <strong className="text-gray-900">Change Tracking:</strong> Browse a comprehensive list of 
                all changes made between editions over time.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Source</h2>
            <p className="text-gray-700 mb-4">
              All textual data is sourced from the excellent{' '}
              <a
                href="https://github.com/BYU-ODH/OpenScripture"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium underline"
              >
                BYU Open Scripture
              </a>{' '}
              project, which has meticulously digitized and verified multiple editions of religious texts.
            </p>
            <p className="text-gray-700">
              We are grateful for their work in making these historical texts available for research and study.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Details</h2>
            <p className="text-gray-700 mb-4">
              This website is built with modern web technologies to ensure fast loading, excellent SEO, 
              and a smooth user experience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Built with Next.js 14 and React</li>
              <li>Styled with Tailwind CSS for responsive design</li>
              <li>Uses diff-match-patch for text comparison</li>
              <li>Static generation for optimal performance</li>
              <li>Fully responsive for mobile and desktop</li>
            </ul>
          </div>

          <div className="bg-primary-50 rounded-xl p-8 border border-primary-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Started</h2>
            <p className="text-gray-700 mb-6">
              Ready to explore the Book of Mormon editions? Start reading or comparing now!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/en/1830/1-nephi/1"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Read 1830 Edition
              </Link>
              <Link
                href="/changes"
                className="inline-block bg-white hover:bg-gray-50 text-primary-600 font-medium px-6 py-3 rounded-lg border border-primary-600 transition-colors"
              >
                View Changes
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
