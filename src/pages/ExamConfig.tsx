import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Target, ChevronRight, Settings } from 'lucide-react';
import { categories } from '@/data/categories';
import { questions } from '@/data/questions';
import { useExamStore } from '@/store/useExamStore';
import { Difficulty } from '@/types';

const difficultyOptions = [
  { value: 'all', label: '全部难度', desc: '随机抽取各种难度题目' },
  { value: 'easy', label: '简单', desc: '入门级题目，适合热身' },
  { value: 'medium', label: '中等', desc: '常见面试题，重点掌握' },
  { value: 'hard', label: '困难', desc: '深度题目，挑战极限' },
];

const countOptions = [5, 10, 15, 20, 30];

const durationOptions = [
  { value: 10, label: '10分钟' },
  { value: 20, label: '20分钟' },
  { value: 30, label: '30分钟' },
  { value: 45, label: '45分钟' },
  { value: 60, label: '60分钟' },
];

export default function ExamConfigPage() {
  const navigate = useNavigate();
  const setConfig = useExamStore((state) => state.setConfig);
  const startExam = useExamStore((state) => state.startExam);

  const [selectedCategory, setSelectedCategory] = useState<string>('java');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [duration, setDuration] = useState<number>(30);

  const categoryQuestions = questions.filter(q => q.categoryId === selectedCategory);
  const filteredCount = selectedDifficulty === 'all'
    ? categoryQuestions.length
    : categoryQuestions.filter(q => q.difficulty === selectedDifficulty).length;

  const actualCount = Math.min(questionCount, filteredCount);

  const handleStartExam = () => {
    setConfig({
      categoryId: selectedCategory,
      difficulty: selectedDifficulty,
      questionCount: actualCount,
      duration,
    });
    startExam();
    navigate('/exam/take');
  };

  return (
    <div className="min-h-screen bg-dark-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm">
              <Settings className="w-4 h-4" />
              <span>模拟考试配置</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              开始一场模拟考试
            </h1>
            <p className="text-dark-400 text-lg">
              根据你的需求自定义考试内容，检验学习成果
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">选择分类</h2>
                  <p className="text-sm text-dark-400">选择你想要练习的技术方向</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedCategory === category.id
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-700 bg-dark-900/50 hover:border-dark-600'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <span className="text-xl">
                        {category.id === 'java' && '☕'}
                        {category.id === 'database' && '🗄️'}
                        {category.id === 'cache' && '⚡'}
                        {category.id === 'mq' && '📨'}
                        {category.id === 'system-design' && '🏗️'}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-white text-center">
                      {category.name}
                    </div>
                    <div className="text-xs text-dark-400 text-center mt-1">
                      {category.questionCount}道题
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">选择难度</h2>
                  <p className="text-sm text-dark-400">根据你的水平选择合适的难度</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedDifficulty(option.value as Difficulty | 'all')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedDifficulty === option.value
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-dark-700 bg-dark-900/50 hover:border-dark-600'
                    }`}
                  >
                    <div className="font-medium text-white">{option.label}</div>
                    <div className="text-xs text-dark-400 mt-1">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">题目数量</h2>
                    <p className="text-sm text-dark-400">
                      可用题目: <span className="text-cyan-400 font-medium">{filteredCount}</span> 道
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {countOptions.map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      disabled={count > filteredCount}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        questionCount === count
                          ? 'bg-cyan-500 text-white'
                          : count > filteredCount
                          ? 'bg-dark-700 text-dark-500 cursor-not-allowed'
                          : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                      }`}
                    >
                      {count} 道
                    </button>
                  ))}
                </div>

                {filteredCount < questionCount && (
                  <p className="text-sm text-yellow-400 mt-3">
                    ⚠️ 当前筛选条件下只有 {filteredCount} 道题，将使用全部可用题目
                  </p>
                )}
              </div>

              <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">考试时长</h2>
                    <p className="text-sm text-dark-400">选择合适的答题时间</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {durationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDuration(option.value)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        duration === option.value
                          ? 'bg-green-500 text-white'
                          : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-500/10 to-cyan-500/10 border border-primary-500/20 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">考试配置预览</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-dark-300">
                    <span>
                      分类: <span className="text-primary-400 font-medium">
                        {categories.find(c => c.id === selectedCategory)?.name}
                      </span>
                    </span>
                    <span>
                      难度: <span className="text-primary-400 font-medium">
                        {difficultyOptions.find(d => d.value === selectedDifficulty)?.label}
                      </span>
                    </span>
                    <span>
                      题量: <span className="text-primary-400 font-medium">{actualCount} 道</span>
                    </span>
                    <span>
                      时长: <span className="text-primary-400 font-medium">{duration} 分钟</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleStartExam}
                  disabled={filteredCount === 0}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  开始考试
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
