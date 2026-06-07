import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';
import QuestionCard from '@/components/QuestionCard';
import { questions } from '@/data/questions';
import { categories } from '@/data/categories';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return questions.filter(
      (q) =>
        q.title.toLowerCase().includes(lowerQuery) ||
        q.content.toLowerCase().includes(lowerQuery) ||
        q.standardSolution.toLowerCase().includes(lowerQuery) ||
        q.pitfalls.some(
          (p) =>
            p.title.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        )
    );
  }, [query]);

  const highlightText = (text: string, keyword: string) => {
    if (!keyword.trim()) return text;
    
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-500/30 text-yellow-200 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-dark-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <SearchIcon className="w-6 h-6 text-primary-400" />
          <h1 className="text-2xl font-bold text-white">
            搜索结果：<span className="text-primary-400">"{query}"</span>
          </h1>
          <span className="px-3 py-1 bg-dark-800 text-dark-300 rounded-full text-sm">
            {searchResults.length} 个结果
          </span>
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((question) => {
              const category = categories.find((c) => c.id === question.categoryId);
              return (
                <div key={question.id}>
                  <QuestionCard
                    question={{
                      ...question,
                      title: highlightText(question.title, query) as unknown as string,
                    }}
                    showCategory
                    categoryName={category?.name}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">未找到相关题目</h3>
            <p className="text-dark-400 mb-6">
              试试其他关键词，或者浏览我们的分类
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="px-4 py-2 bg-dark-800 text-dark-300 rounded-lg hover:bg-dark-700 hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
