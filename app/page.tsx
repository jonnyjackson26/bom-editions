import Link from 'next/link';
import Image from 'next/image';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { EDITIONS, BOOKS } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Book of Mormon Editions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            An <a href="https://github.com/jonnyjackson26/bom-editions" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium">open source</a> tool to read past editions of the Book of Mormon, easily compare them, and explore the detailed list of changes between them.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link
            href="/en/1830/1-nephi/1"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
          >
            Read 1830 Edition
          </Link>
          <Link
            href="/en/1830/1-nephi/1?compare=2013"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
          >
            See changes from 1830 Edition
          </Link>
          <Link
            href="/en/simultaneous/1-nephi/1"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
          >
            Read All Editions <em>Verse-by-Verse</em>
          </Link>
          <Link
            href="/changes/all"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
          >
            See List of All Changes
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
          >
            About
          </Link>
        </div>

        {/* Features */}
        <section className="mb-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/en/editions" className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:border-primary-500 transition-all hover:shadow-xl">
              <Image
                src="/screenshots/1830-1-nephi-1.png"
                alt="Reading the 1830 edition of 1 Nephi"
                width={800}
                height={600}
                className="w-full h-auto"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">Read Complete Editions</h3>
                <p className="text-sm text-gray-600">Read the complete text of the 1830, 1837, and other editions of the Book of Mormon</p>
              </div>
            </Link>
            <Link href="/en/1830/1-nephi/1?compare=2013" className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:border-primary-500 transition-all hover:shadow-xl">
              <Image
                src="/screenshots/1830-with-2013-comparison.png"
                alt="Comparing 1830 and 2013 editions side-by-side"
                width={800}
                height={600}
                className="w-full h-auto"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">See Inline Differences</h3>
                <p className="text-sm text-gray-600">See inline differences between editions</p>
              </div>
            </Link>
            <Link href="/changes/1837" className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:border-primary-500 transition-all hover:shadow-xl">
              <Image
                src="/screenshots/changes-1830-1837.png"
                alt="Viewing changes between 1830 and 1837 editions"
                width={800}
                height={600}
                className="w-full h-auto"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">Track All Changes</h3>
                <p className="text-sm text-gray-600">Browse comprehensive change history</p>
              </div>
            </Link>
            <Link href="/en/simultaneous/1-nephi/1" className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:border-primary-500 transition-all hover:shadow-xl">
              <Image
                src="/screenshots/simultaneous.png"
                alt="Simultaneous view of all editions"
                width={800}
                height={600}
                className="w-full h-auto"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">Simultaneous View</h3>
                <p className="text-sm text-gray-600">Compare all editions at once</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Editions Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Available Editions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EDITIONS.map((edition) => (
              <Link
                key={edition}
                href={`/en/${edition}/1-nephi/1`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200 hover:border-primary-500"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">
                    {edition}
                  </div>
                  <div className="text-sm text-gray-500">Edition</div>
                  <div className="mt-4 text-primary-600 text-sm font-medium">
                    Read →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
