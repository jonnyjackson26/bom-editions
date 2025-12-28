import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
        <p className="mb-2">
          Data sourced from{' '}
          <a
            href="https://github.com/BYU-ODH/OpenScripture"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            BYU Open Scripture
          </a>
        </p>
        <p className="mb-2">
          <a
            href="https://github.com/jonnyjackson26/bom-editions2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View Source Code on GitHub
          </a>
        </p>
        <p className="text-sm mb-2">
          <Link href="/about" className="text-primary-600 hover:text-primary-700">
            Learn more about this project
          </Link>
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Not affiliated with the Church of Jesus Christ of Latter-Day Saints
        </p>
      </div>
    </footer>
  );
}
