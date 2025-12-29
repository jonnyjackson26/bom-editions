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
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About the Book of Mormon Editions Project</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              The Book of Mormon Editions Project is an independent, nonpartisan digital resource dedicated to documenting and presenting the historical textual development of the Book of Mormon. Its purpose is to provide readers, researchers, and students with clear, direct access to multiple published editions, enabling careful study and transparent comparison over time.
            </p>
            
            <p className="text-gray-700 mb-4">
              All textual data used in this project is sourced from the&nbsp;
              <a
                href="https://github.com/BYU-ODH/OpenScripture"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium underline"
              >
                BYU Open Scripture Project
              </a>
              , whose meticulous work in digitizing historical editions of the Book of Mormon has made rigorous textual study possible. This project gratefully acknowledges their contribution and relies on their data as its authoritative textual foundation.
            </p>
            
            <p className="text-gray-700 mb-4">
              The site currently includes the following editions of the Book of Mormon:
            </p>
            
            <p className="text-gray-700 mb-6">
              <strong>1830, 1837, 1840, 1841, 1879, 1920, 1981, and 2013</strong>
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Features</h2>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Read Complete Editions</h3>
                <p className="text-gray-700">
                  Read the complete text of each included edition with clean, consistent formatting.
                  <Link href="/en/editions" className="ml-2 text-primary-600 hover:text-primary-700 font-medium">Explore editions →</Link>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">See Inline Differences</h3>
                <p className="text-gray-700">
                  Compare editions with inline highlights showing additions, deletions, and modifications.
                  <Link href="/en/1830/1-nephi/1?compare=2013" className="ml-2 text-primary-600 hover:text-primary-700 font-medium">Try a comparison →</Link>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Simultaneous View</h3>
                <p className="text-gray-700">
                  View all editions at once to observe broader patterns of textual development.
                  <Link href="/en/simultaneous/1-nephi/1" className="ml-2 text-primary-600 hover:text-primary-700 font-medium">Open simultaneous view →</Link>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Track All Changes</h3>
                <p className="text-gray-700">
                  Browse a comprehensive, structured record of textual changes across editions.
                  <Link href="/changes/all" className="ml-2 text-primary-600 hover:text-primary-700 font-medium">View all changes →</Link>
                </p>
              </div>
            </div>
            

            <p className="text-gray-700">
              This project is designed to support informed study by presenting historical data as accurately and transparently as possible, without interpretation or editorial bias.
            </p>

            <p className="text-gray-700">
              This project seeks to present historical textual data as accurately and transparently as possible, without interpretation or editorial bias. While absolute neutrality is impossible, I value openness and clarity. I therefore acknowledge that I am a member in good standing of The Church of Jesus Christ of Latter-day Saints and personally believe the Book of Mormon to be the word of God.
            </p>

            <p className="text-gray-700 mt-6">
              The source code for this project is available on{' '}
              <a
                href="https://github.com/jonnyjackson26/bom-editions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium underline"
              >
                GitHub
              </a>.
            </p>

            <p className="text-gray-700 mt-2">
              You can find more about me and this project at my website:&nbsp;
              <a
                href="https://jonny-jackson.com/posts/book-of-mormon-editions-project/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium underline"
              >
                jonny-jackson.com
              </a>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
