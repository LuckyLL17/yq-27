import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Home from "@/pages/Home";
import Category from "@/pages/Category";
import QuestionDetail from "@/pages/QuestionDetail";
import SearchPage from "@/pages/Search";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-900 flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId" element={<Category />} />
            <Route path="/question/:questionId" element={<QuestionDetail />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>
        <footer className="border-t border-dark-700 py-8 mt-auto">
          <div className="container mx-auto px-4 text-center text-dark-500 text-sm">
            <p>程序员面试题库 - 不只是背题，更懂原理</p>
            <p className="mt-2">覆盖 Java · 数据库 · 缓存 · 消息队列 · 系统设计</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
