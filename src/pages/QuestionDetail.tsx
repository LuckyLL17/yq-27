import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
  AlertTriangle,
  Code,
  Flame,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import PitfallCard from '@/components/PitfallCard';
import QuestionCard from '@/components/QuestionCard';
import { questions } from '@/data/questions';
import { categories } from '@/data/categories';

export default function QuestionDetail() {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [showSolution, setShowSolution] = useState(true);
  const [showPitfalls, setShowPitfalls] = useState(true);

  const question = questions.find((q) => q.id === questionId);
  const category = categories.find((c) => c.id === question?.categoryId);
  
  const relatedQuestions = question
    ? question.relatedQuestionIds
        .map((id) => questions.find((q) => q.id === id))
        .filter(Boolean)
        .slice(0, 3)
    : [];

  const currentIndex = questions.findIndex((q) => q.id === questionId);
  const prevQuestion = currentIndex > 0 ? questions[currentIndex - 1] : null;
  const nextQuestion =
    currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null;

  const difficultyConfig = {
    easy: { label: '简单', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
    medium: { label: '中等', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    hard: { label: '困难', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  };

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">题目不存在</h1>
        <Link to="/" className="text-primary-400 hover:text-primary-300">
          返回首页
        </Link>
      </div>
    );
  }

  const difficulty = difficultyConfig[question.difficulty];

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inList = false;

    lines.forEach((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <h3 key={index} className="text-lg font-semibold text-white mt-4 mb-2">
            {line.replace(/\*\*/g, '')}
          </h3>
        );
      } else if (line.startsWith('- ')) {
        if (!inList) {
          inList = true;
          elements.push(
            <ul key={`ul-${index}`} className="list-disc list-inside space-y-1 text-dark-300">
              <li>{line.slice(2)}</li>
            </ul>
          );
        } else {
          const lastUl = elements[elements.length - 1] as React.ReactElement;
          if (lastUl && lastUl.type === 'ul') {
            elements[elements.length - 1] = (
              <ul key={`ul-${index}`} className="list-disc list-inside space-y-1 text-dark-300">
                {...lastUl.props.children}
                <li>{line.slice(2)}</li>
              </ul>
            );
          }
        }
      } else if (line.startsWith('  - ')) {
        elements.push(
          <div key={index} className="ml-6 list-disc list-inside text-dark-400">
            {line.slice(4)}
          </div>
        );
      } else if (line.startsWith('**')) {
        const parts = line.split('**');
        elements.push(
          <p key={index} className="text-dark-300 leading-relaxed">
            <strong className="text-white font-medium">{parts[1]}</strong>
            {parts.slice(2).join('**')}
          </p>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={index} className="h-2" />);
        inList = false;
      } else if (/^\d+\./.test(line)) {
        elements.push(
          <div key={index} className="flex gap-2 text-dark-300">
            <span className="text-primary-400 font-medium flex-shrink-0">
              {line.match(/^\d+/)?.[0]}.
            </span>
            <span>{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      } else {
        elements.push(
          <p key={index} className="text-dark-300 leading-relaxed">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="container mx-auto px-4 py-8">
        {/* 返回导航 */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-dark-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
          <ChevronRight className="w-4 h-4 text-dark-600" />
          <Link
            to={`/category/${category?.id}`}
            className="text-dark-400 hover:text-white transition-colors"
          >
            {category?.name}
          </Link>
          <ChevronRight className="w-4 h-4 text-dark-600" />
          <span className="text-dark-300 truncate max-w-xs">
            {question.title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 主内容区 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 题目卡片 */}
            <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 flex-wrap mb-4">
                {question.isHot && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-orange-500/10 text-orange-400 rounded-full">
                    <Flame className="w-4 h-4" />
                    高频面试题
                  </span>
                )}
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full border ${difficulty.className}`}
                >
                  {difficulty.label}
                </span>
                <span className="px-3 py-1 text-sm font-medium bg-primary-500/10 text-primary-400 rounded-full">
                  {category?.name}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">
                {question.title}
              </h1>
              <div className="prose-custom">
                <p className="text-dark-300 text-lg leading-relaxed">
                  {question.content}
                </p>
              </div>
            </div>

            {/* 标准解法 */}
            <div className="bg-dark-800/50 border border-dark-700 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="w-full flex items-center justify-between p-6 hover:bg-dark-800/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-semibold text-white">
                      标准解法
                    </h2>
                    <p className="text-sm text-dark-400">
                      系统梳理解题思路，从零到一理解
                    </p>
                  </div>
                </div>
                {showSolution ? (
                  <ChevronUp className="w-5 h-5 text-dark-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-dark-400" />
                )}
              </button>
              {showSolution && (
                <div className="px-6 pb-6 border-t border-dark-700 pt-6 animate-fade-in">
                  <div className="prose-custom">
                    {renderMarkdown(question.standardSolution)}
                  </div>
                </div>
              )}
            </div>

            {/* 代码示例 */}
            {question.codeExamples.length > 0 && (
              <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <Code className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">代码示例</h2>
                    <p className="text-sm text-dark-400">
                      结合实际代码，加深理解
                    </p>
                  </div>
                </div>
                {question.codeExamples.map((example, index) => (
                  <CodeBlock
                    key={index}
                    code={example.code}
                    language={example.language}
                  />
                ))}
              </div>
            )}

            {/* 坑点分析 */}
            <div className="bg-dark-800/50 border border-dark-700 rounded-2xl overflow-hidden">
              <button
                onClick={() => setShowPitfalls(!showPitfalls)}
                className="w-full flex items-center justify-between p-6 hover:bg-dark-800/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-semibold text-white">
                      💥 坑点分析
                    </h2>
                    <p className="text-sm text-dark-400">
                      实际项目中容易翻车的{question.pitfalls.length}个点
                    </p>
                  </div>
                </div>
                {showPitfalls ? (
                  <ChevronUp className="w-5 h-5 text-dark-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-dark-400" />
                )}
              </button>
              {showPitfalls && (
                <div className="px-6 pb-6 border-t border-dark-700 pt-6">
                  <div className="space-y-4">
                    {question.pitfalls.map((pitfall, index) => (
                      <PitfallCard
                        key={index}
                        pitfall={pitfall}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 上一题/下一题 */}
            <div className="flex items-center justify-between gap-4">
              {prevQuestion ? (
                <Link
                  to={`/question/${prevQuestion.id}`}
                  className="flex-1 p-4 bg-dark-800/50 border border-dark-700 rounded-xl hover:border-primary-500/50 transition-colors group"
                >
                  <div className="text-sm text-dark-400 mb-1">← 上一题</div>
                  <div className="text-white group-hover:text-primary-400 transition-colors line-clamp-1">
                    {prevQuestion.title}
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {nextQuestion ? (
                <Link
                  to={`/question/${nextQuestion.id}`}
                  className="flex-1 p-4 bg-dark-800/50 border border-dark-700 rounded-xl hover:border-primary-500/50 transition-colors group text-right"
                >
                  <div className="text-sm text-dark-400 mb-1">下一题 →</div>
                  <div className="text-white group-hover:text-primary-400 transition-colors line-clamp-1">
                    {nextQuestion.title}
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 相关题目 */}
            {relatedQuestions.length > 0 && (
              <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4">
                  相关题目
                </h3>
                <div className="space-y-3">
                  {relatedQuestions.map((q) =>
                    q ? (
                      <Link
                        key={q.id}
                        to={`/question/${q.id}`}
                        className="block p-3 bg-dark-900/50 rounded-lg hover:bg-dark-700/50 transition-colors group"
                      >
                        <div className="text-sm text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                          {q.title}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              q.difficulty === 'easy'
                                ? 'bg-green-500/10 text-green-400'
                                : q.difficulty === 'medium'
                                ? 'bg-yellow-500/10 text-yellow-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {q.difficulty === 'easy'
                              ? '简单'
                              : q.difficulty === 'medium'
                              ? '中等'
                              : '困难'}
                          </span>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* 学习提示 */}
            <div className="bg-gradient-to-br from-primary-500/10 to-cyan-500/10 border border-primary-500/20 rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-white mb-3">💡 学习建议</h3>
              <ul className="space-y-2 text-sm text-dark-300">
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">•</span>
                  先理解标准解法，再看坑点分析
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">•</span>
                  坑点是面试加分项，务必掌握
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">•</span>
                  动手写代码，不要只看不练
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">•</span>
                  结合实际项目经验思考
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 更多题目推荐 */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-6">该分类更多题目</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions
              .filter((q) => q.categoryId === question.categoryId && q.id !== question.id)
              .slice(0, 3)
              .map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
