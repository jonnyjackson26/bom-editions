import Link from 'next/link';
import Image from 'next/image';
import { getBookName } from '@/lib/constants';

interface LogoAndTitleProps {
  book?: string;
  chapter?: number;
  edition?: string;
  isAtTop?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function LogoAndTitle({ book, chapter, edition, isAtTop = true, className = '', onClick }: LogoAndTitleProps) {
  return (
    <Link href="/" className={`flex items-center space-x-3 group ${className}`} onClick={onClick}>
      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform p-2">
        <Image 
          src="/favicon/favicon.svg" 
          alt="Book of Mormon" 
          width={32} 
          height={32}
          className="brightness-0 invert"
        />
      </div>
      <div>
        {book && chapter ? (
          <>
            {isAtTop ? (
              <>
                <h1 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  Book of Mormon Editions
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Compare editions from 1830-2013</p>
              </>
            ) : (
              <>
                <h1 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {getBookName(book)} {chapter}
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {edition === 'simultaneous' ? 'Simultaneous Edition' : `${edition} Edition`}
                </p>
              </>
            )}
          </>
        ) : (
          <>
            <h1 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              Book of Mormon Editions
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">Compare editions from 1830-2013</p>
          </>
        )}
      </div>
    </Link>
  );
}
