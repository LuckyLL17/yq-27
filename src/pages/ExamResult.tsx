import { useState, Children } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  RotateCcw,
  Home,
  ChevronDown,
  ChevronUp,
  BookOpen,
  AlertTriangle,
  Code,
  Flame,
} from 'lucide-react';
import { useExamStore } from '@/store/useExamStore';
import CodeBlock from '@/components/CodeBlock';
import PitfallCard from '@/components/PitfallCard';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}分${secs}秒`;
}

function evaluateAnswer(userAnswer: string, standardSolution: string): boolean {
  if (!userAnswer.trim()) return false;
  const userLower = userAnswer.toLowerCase().trim();
  const solutionLower = standardSolution.toLowerCase();
  const keywords = solutionLower.match(/[\u4e00-\u9fa5a-zA-Z]+/g) || [];
  const uniqueKeywords = [...new Set(keywords.filter(k => k.length >= 2))];
  const matchCount = uniqueKeywords.filter(keyword => userLower.includes(keyword)).length;
  return uniqueKeywords.length > 0 && matchCount / uniqueKeywords.length >= 0.3;
}

export default function ExamResultPage() {
  const navigate = useNavigate();
  const { result, resetExam, config } = useExamStore();
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'wrong' | 'unanswered'>('all');

  if (!result) {
    navigate('/exam/config');
    return null;
  }

  const toggleQuestion = (index: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleRetry = () => {
    resetExam();
    navigate('/exam/config');
  };

  const handleHome = () => {
    resetExam();
    navigate('/');
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { label: '优秀', color: 'text-green-400', bg: 'from-green-500/20 to-emerald-500/20' };
    if (score >= 70) return { label: '良好', color: 'text-blue-400', bg: 'from-blue-500/20 to-cyan-500/20' };
    if (score >= 60) return { label: '及格', color: 'text-yellow-400', bg: 'from-yellow-500/20 to-orange-500/20' };
    return { label: '需加油', color: 'text-red-400', bg: 'from-red-500/20 to-pink-500/20' };
  };

  const scoreLevel = getScoreLevel(result.score);

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inList = false;

    lines.forEach((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <h4 key={index} className="text-base font-semibold text-white mt-3 mb-2">
            {line.replace(/\*\*/g, '')}
          </h4>
        );
      } else if (line.startsWith('- ')) {
        if (!inList) {
          inList = true;
          elements.push(
            <ul key={`ul-${index}`} className="list-disc list-inside space-y-1 text-dark-300 text-sm">
              <li>{line.slice(2)}</li>
            </ul>
          );
        } else {
          const lastUl = elements[elements.length - 1] as React.ReactElement;
          if (lastUl && lastUl.type === 'ul') {
            const childrenArray = Children.toArray(lastUl.props.children);
            elements[elements.length - 1] = (
              <ul key={`ul-${index}`} className="list-disc list-inside space-y-1 text-dark-300 text-sm">
                {childrenArray}
                <li>{line.slice(2)}</li>
              </ul>
            );
          }
        }
      } else if (line.startsWith('  - ')) {
        elements.push(
          <div key={index} className="ml-6 list-disc list-inside text-dark-400 text-sm">
            {line.slice(4)}
          </div>
        );
      } else if (line.startsWith('**')) {
        const parts = line.split('**');
        elements.push(
          <p key={index} className="text-dark-300 leading-relaxed text-sm">
            <strong className="text-white font-medium">{parts[1]}</strong>
            {parts.slice(2).join('**')}
          </p>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={index} className="h-2" />);
        inList = false;
      } else if (/^\d+\./.test(line)) {
        elements.push(
          <div key={index} className="flex gap-2 text-dark-300 text-sm">
            <span className="text-primary-400 font-medium flex-shrink-0">
              {line.match(/^\d+/)?.[0]}.
            </span>
            <span>{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      } else {
        elements.push(
          <p key={index} className="text-dark-300 leading-relaxed text-sm">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  const filteredAnswers = result.answers.filter((eq) => {
    const isCorrect = evaluateAnswer(eq.userAnswer, eq.question.standardSolution);
    if (filterType === 'correct') return eq.isAnswered && isCorrect;
    if (filterType === 'wrong') return eq.isAnswered && !isCorrect;
    if (filterType === 'unanswered') return !eq.isAnswered;
    return true;
  });

  const getFilteredIndex = (originalIndex: number) => {
    let count = 0;
    for (let i = 0; i < originalIndex; i++) {
      const eq = result.answers[i];
      const isCorrect = evaluateAnswer(eq.userAnswer, eq.question.standardSolution);
      if (filterType === 'all') count++;
      else if (filterType === 'correct' && eq.isAnswered && isCorrect) count++;
      else if (filterType === 'wrong' && eq.isAnswered && !isCorrect) count++;
      else if (filterType === 'unanswered' && !eq.isAnswered) count++;
    }
    return count + 1;
  };

  const difficultyConfig = {
    easy: { label: '简单', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
    medium: { label: '中等', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    hard: { label: '困难', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  };

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`bg-gradient-to-br ${scoreLevel.bg} border border-dark-700 rounded-2xl p-8 mb-8 text-center`}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-dark-800/50 flex items-center justify-center">
              <Trophy className={`w-10 h-10 ${scoreLevel.color}`} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">考试结束</h1>
            <p className="text-dark-400 mb-6">
              {config?.categoryId && `分类: ${config.categoryId}`} · 
              共 {result.totalQuestions} 题
            </p>

            <div className="text-6xl font-bold mb-2">
              <span className={scoreLevel.color}>{result.score}</span>
              <span className="text-3xl text-dark-500">分</span>
            </div>
            <p className={`text-lg font-medium ${scoreLevel.color} mb-8`}>
              {scoreLevel.label}
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="bg-dark-800/50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-2xl font-bold">{result.correctCount}</span>
                </div>
                <p className="text-xs text-dark-400">答对</p>
              </div>
              <div className="bg-dark-800/50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 text-red-400 mb-1">
                  <XCircle className="w-5 h-5" />
                  <span className="text-2xl font-bold">{result.wrongCount}</span>
                </div>
                <p className="text-xs text-dark-400">答错</p>
              </div>
              <div className="bg-dark-800/50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 text-yellow-400 mb-1">
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-2xl font-bold">{result.unansweredCount}</span>
                </div>
                <p className="text-xs text-dark-400">未答</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-dark-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>用时 {formatTime(result.timeSpent)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>正确率 {result.totalQuestions > 0 ? Math.round((result.correctCount / result.totalQuestions) * 100) : 0}%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              再来一次
            </button>
            <button
              onClick={handleHome}
              className="flex items-center gap-2 px-5 py-2.5 bg-dark-800 hover:bg-dark-700 text-white font-medium rounded-xl transition-colors"
            >
              <Home className="w-4 h-4" />
              返回首页
            </button>

            <div className="flex-1" />

            <div className="flex gap-1 bg-dark-800 rounded-lg p-1">
              {[
                { value: 'all', label: '全部' },
                { value: 'wrong', label: '错题' },
                { value: 'correct', label: '答对' },
                { value: 'unanswered', label: '未答' },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilterType(item.value as typeof filterType)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    filterType === item.value
                      ? 'bg-dark-700 text-white'
                      : 'text-dark-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {result.answers.map((eq, originalIndex) => {
              const isCorrect = evaluateAnswer(eq.userAnswer, eq.question.standardSolution);
              const shouldShow = 
                filterType === 'all' ||
                (filterType === 'correct' && eq.isAnswered && isCorrect) ||
                (filterType === 'wrong' && eq.isAnswered && !isCorrect) ||
                (filterType === 'unanswered' && !eq.isAnswered);

              if (!shouldShow) return null;

              const isExpanded = expandedQuestions.has(originalIndex);
              const difficulty = difficultyConfig[eq.question.difficulty];
              const displayIndex = getFilteredIndex(originalIndex);

              return (
                <div
                  key={originalIndex}
                  className="bg-dark-800/50 border border-dark-700 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleQuestion(originalIndex)}
                    className="w-full flex items-start gap-4 p-5 hover:bg-dark-800/80 transition-colors text-left"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                      !eq.isAnswered ? 'bg-yellow-500/10' :
                      isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}>
                      {!eq.isAnswered ? (
                        <HelpCircle className="w-5 h-5 text-yellow-400" />
                      ) : isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-medium text-primary-400">
                          第 {displayIndex} 题
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full border ${difficulty.className}`}
                        >
                          {difficulty.label}
                        </span>
                        {eq.question.isHot && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-orange-500/10 text-orange-400 rounded-full">
                            <Flame className="w-3 h-3" />
                            热门
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-medium text-white line-clamp-1">
                        {eq.question.title}
                      </h3>
                    </div>

                    <div className="flex-shrink-0 mt-1">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-dark-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-dark-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-dark-700 p-5 space-y-6 animate-fade-in">
                      <div>
                        <h4 className="text-sm font-semibold text-dark-400 uppercase tracking-wide mb-2">
                          题目描述
                        </h4>
                        <p className="text-dark-300 leading-relaxed whitespace-pre-wrap">
                          {eq.question.content}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-dark-400 uppercase tracking-wide mb-2">
                          你的答案
                          {!eq.isAnswered && (
                            <span className="ml-2 text-yellow-400 text-xs font-normal">（未作答）</span>
                          )}
                          {eq.isAnswered && !isCorrect && (
                            <span className="ml-2 text-red-400 text-xs font-normal">（答案不准确）</span>
                          )}
                          {eq.isAnswered && isCorrect && (
                            <span className="ml-2 text-green-400 text-xs font-normal">（回答正确）</span>
                          )}
                        </h4>
                        <div className={`p-4 rounded-xl ${
                          !eq.isAnswered ? 'bg-yellow-500/5 border border-yellow-500/20' :
                          isCorrect ? 'bg-green-500/5 border border-green-500/20' : 'bg-red-500/5 border border-red-500/20'
                        }`}>
                          {eq.userAnswer ? (
                            <p className="text-dark-300 whitespace-pre-wrap text-sm leading-relaxed">
                              {eq.userAnswer}
                            </p>
                          ) : (
                            <p className="text-dark-500 italic">未作答</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-green-400" />
                          </div>
                          <h4 className="text-sm font-semibold text-white">
                            标准解析
                          </h4>
                        </div>
                        <div className="bg-dark-900/50 rounded-xl p-4 border border-dark-700">
                          {renderMarkdown(eq.question.standardSolution)}
                        </div>
                      </div>

                      {eq.question.codeExamples.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                              <Code className="w-4 h-4 text-cyan-400" />
                            </div>
                            <h4 className="text-sm font-semibold text-white">
                              代码示例
                            </h4>
                          </div>
                          <div className="space-y-3">
                            {eq.question.codeExamples.map((example, idx) => (
                              <CodeBlock
                                key={idx}
                                code={example.code}
                                language={example.language}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {eq.question.pitfalls.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                            </div>
                            <h4 className="text-sm font-semibold text-white">
                              💥 坑点分析（{eq.question.pitfalls.length}个）
                            </h4>
                          </div>
                          <div className="space-y-3">
                            {eq.question.pitfalls.map((pitfall, idx) => (
                              <PitfallCard key={idx} pitfall={pitfall} index={idx} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredAnswers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark-400">该分类下没有题目</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
