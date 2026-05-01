import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Search, Loader2, ExternalLink, Download, User as UserIcon, Star, Filter } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { AppLanguage } from '../types';

interface EBook {
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  previewLink: string;
  rating?: number;
  pageCount?: number;
  categories?: string[];
}

interface EBooksProps {
  theme: 'light' | 'dark';
  language: AppLanguage;
}

const EBooks: React.FC<EBooksProps> = ({ theme, language }) => {
  const [query, setQuery] = useState('programming');
  const [books, setBooks] = useState<EBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<EBook | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS['ENGLISH'];

  useEffect(() => {
    searchBooks();
  }, []);

  const searchBooks = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=40&printType=books`);
      if (response.ok) {
        const data = await response.json();
        const formattedBooks = data.items?.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors || ['Unknown Author'],
          description: item.volumeInfo.description || 'No description available.',
          thumbnail: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150x200?text=No+Cover',
          previewLink: item.volumeInfo.previewLink,
          rating: item.volumeInfo.averageRating,
          pageCount: item.volumeInfo.pageCount,
          categories: item.volumeInfo.categories
        })) || [];
        setBooks(formattedBooks);
      }
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-80px)] overflow-hidden ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
              <Book className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{t.EBOOKS}</h2>
              <p className="text-sm opacity-50">Access to more than 500,000+ E-Books</p>
            </div>
          </div>

          <form onSubmit={searchBooks} className="flex-1 max-w-xl flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.SEARCH_EBOOKS}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[#D4AF37] transition-all text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 bg-[#D4AF37] hover:bg-[#B8962E] disabled:opacity-50 text-black font-bold rounded-2xl transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {t.SEARCH}
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4 opacity-50">
              <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
              <p className="text-lg font-medium">Searching thousands of E-Books...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {books.map((book) => (
                <motion.div
                  key={book.id}
                  layoutId={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="group cursor-pointer space-y-3"
                  whileHover={{ y: -5 }}
                >
                  <div className="aspect-[2/3] relative rounded-xl overflow-hidden shadow-lg border border-white/5 bg-white/5">
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                      <p className="text-xs font-medium text-white line-clamp-4">{book.description}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold line-clamp-2 group-hover:text-[#D4AF37] transition-colors">{book.title}</h3>
                    <p className="text-xs opacity-50 line-clamp-1">{book.authors.join(', ')}</p>
                    {book.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-bold">{book.rating}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBook(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              layoutId={selectedBook.id}
              className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl border border-white/10 ${
                theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-white'
              }`}
            >
              <div className="flex flex-col md:flex-row h-full overflow-y-auto">
                <div className="w-full md:w-1/3 p-8 bg-black/20 flex flex-col items-center gap-6">
                  <img
                    src={selectedBook.thumbnail}
                    alt={selectedBook.title}
                    className="w-full max-w-[200px] aspect-[2/3] object-cover rounded-xl shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                  <div className="w-full space-y-4">
                    <a
                      href={selectedBook.previewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-4 bg-[#D4AF37] hover:bg-[#B8962E] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Read Preview
                    </a>
                    <button className="w-full p-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10">
                      <Download className="w-5 h-5" />
                      Download E-Book
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-8 space-y-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold tracking-tight">{selectedBook.title}</h2>
                      <div className="flex items-center gap-2 text-lg opacity-70">
                        <UserIcon className="w-5 h-5" />
                        <span>{selectedBook.authors.join(', ')}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedBook(null)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {selectedBook.categories?.map(cat => (
                      <span key={cat} className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold rounded-full border border-[#D4AF37]/20 uppercase tracking-wider">
                        {cat}
                      </span>
                    ))}
                    {selectedBook.pageCount && (
                      <span className="px-3 py-1 bg-white/5 text-white/50 text-xs font-bold rounded-full border border-white/10">
                        {selectedBook.pageCount} Pages
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Filter className="w-5 h-5 text-[#D4AF37]" />
                      Description
                    </h3>
                    <div 
                      className="text-sm leading-relaxed opacity-70"
                      dangerouslySetInnerHTML={{ __html: selectedBook.description }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default EBooks;
