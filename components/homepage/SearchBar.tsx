import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PremiumBadge } from './PremiumBadge';

interface SearchResult {
  id: number;
  tenTinTuc: string;
  moTa: string;
  hinhAnh: string;
  isPremium: boolean;
  thoiGianDang: string;
  nguoiDung: {
    id: number;
    tenNguoiDung: string;
  } | null;
  bookmarks: number;
  binhLuan: number;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.posts || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    if (onSearch) {
      onSearch('');
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    }
    return postDate.toLocaleDateString('vi-VN');
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
            isFocused
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Tìm kiếm bài viết..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          {isLoading && (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 max-h-[500px] overflow-y-auto">
          <div className="p-2 border-b border-border bg-muted/50">
            <p className="text-xs text-muted-foreground px-2">
              Tìm thấy {results.length} kết quả
            </p>
          </div>
          <div className="divide-y divide-border">
            {results.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="flex gap-3 p-3 hover:bg-muted/50 transition-colors group"
                onClick={() => {
                  setShowResults(false);
                  setIsFocused(false);
                }}
              >
                <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={post.hinhAnh}
                    alt={post.tenTinTuc}
                    fill
                    className="object-cover"
                  />
                  {post.isPremium && (
                    <div className="absolute top-1 right-1">
                      <PremiumBadge size="sm" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {post.tenTinTuc}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                    {post.moTa}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {post.nguoiDung && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {post.nguoiDung.tenNguoiDung}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(post.thoiGianDang)}
                    </span>
                    <span>💬 {post.binhLuan}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showResults && query.trim().length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-6 text-center z-50">
          <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">
            Không tìm thấy kết quả cho &quot;{query}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
