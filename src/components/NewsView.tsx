import React, { useState } from 'react';
import { Newspaper, Heart, MessageSquare, Search, Award, Calendar, Sparkles } from 'lucide-react';
import { NewsArticle } from '../types.js';

interface NewsViewProps {
  news: NewsArticle[];
  currentUser: any;
  onLikeArticle: (id: string) => Promise<any>;
  onAddComment: (id: string, commentText: string) => Promise<any>;
}

export default function NewsView({
  news,
  currentUser,
  onLikeArticle,
  onAddComment
}: NewsViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<string>(news[0]?.id || '');
  const [commentInput, setCommentInput] = useState('');

  const currentArticle = news.find(n => n.id === selectedArticleId) || news[0];

  const handleLike = async (id: string) => {
    await onLikeArticle(id);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !currentArticle) return;
    await onAddComment(currentArticle.id, commentInput);
    setCommentInput('');
  };

  // Filter news articles based on selected category and text search query
  const filteredArticles = news.filter((art) => {
    const matchesCategory = activeCategory === 'All' || art.category === activeCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Match Report', 'Announcement', 'Interview', 'Injury'];

  return (
    <div className="space-y-6" id="news-section">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-black text-white uppercase tracking-tight">
            Championship News & Press Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Breaking reports, exclusive team interviews, official injury announcements, and community fan reactions.
          </p>
        </div>

        {/* Global News Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news, tags, or articles..."
            className="w-full rounded-xl border border-slate-850 bg-slate-900/60 pl-10 pr-4 py-3 text-xs font-semibold text-slate-200 focus:border-lime-400 focus:outline-none placeholder:text-slate-550"
          />
        </div>
      </div>

      {/* Main Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* News list (Left 5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 border-b border-slate-850 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? 'bg-lime-400 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                {cat === 'All' ? 'All Articles' : `${cat}s`}
              </button>
            ))}
          </div>

          {/* Cards stack */}
          <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredArticles.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No matching articles found in press logs.</p>
            ) : (
              filteredArticles.map((art) => {
                const isActive = currentArticle?.id === art.id;
                return (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticleId(art.id)}
                    className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                      isActive
                        ? 'border-lime-400 bg-slate-900/80 shadow-[0_0_15px_rgba(163,230,53,0.03)]'
                        : 'border-slate-850 bg-slate-900/30 hover:border-slate-800 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 font-bold uppercase">
                      <span className="text-lime-400">{art.category}</span>
                      <span>{art.readTime}</span>
                    </div>
                    
                    <h4 className="font-sans text-xs font-bold text-slate-200 mt-2 line-clamp-2 leading-snug hover:text-white transition-colors">
                      {art.title}
                    </h4>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {art.tags.slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx} className="rounded px-1.5 py-0.5 bg-slate-950 border border-slate-900 text-[8px] font-mono font-bold uppercase text-slate-400">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Likes & Comments Quick Info */}
                    <div className="flex items-center space-x-4 text-[10px] text-slate-500 font-mono mt-3.5 pt-3 border-t border-slate-900/40">
                      <span className="flex items-center space-x-1">
                        <Heart className="h-3.5 w-3.5 text-red-500/80" />
                        <span>{art.likes}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="h-3.5 w-3.5 text-lime-400/80" />
                        <span>{art.comments.length} Comments</span>
                      </span>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Article Reader Board (Right 7 Columns) */}
        <div className="lg:col-span-7">
          {currentArticle ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur shadow-xl space-y-6">
              
              {/* Reader Header */}
              <div className="space-y-2 border-b border-slate-850 pb-4">
                <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wide">
                  <span className="text-lime-400">{currentArticle.category}</span>
                  <span className="text-slate-500 flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{currentArticle.date}</span>
                  </span>
                </div>
                
                <h3 className="font-sans text-lg sm:text-xl font-black text-white leading-snug uppercase">
                  {currentArticle.title}
                </h3>
              </div>

              {/* Content Body */}
              <p className="font-sans text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {currentArticle.content}
              </p>

              {/* Reader Interaction Toolbar */}
              <div className="flex items-center space-x-3 py-3 border-y border-slate-850">
                <button
                  onClick={() => handleLike(currentArticle.id)}
                  className="flex items-center space-x-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4.5 py-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Heart className="h-4 w-4 fill-red-400/20" />
                  <span>Like Article ({currentArticle.likes})</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="space-y-5">
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-lime-400" />
                  <span>Fan Clubhouse Comments ({currentArticle.comments.length})</span>
                </h4>

                {/* Comment Feed */}
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {currentArticle.comments.length === 0 ? (
                    <p className="text-[11px] text-slate-500 italic py-2">No fan comments logged for this report yet. Join the conversation below!</p>
                  ) : (
                    currentArticle.comments.map((comment) => (
                      <div key={comment.id} className="rounded-2xl bg-slate-950 p-3.5 border border-slate-900 flex items-start space-x-3">
                        <span className="text-lg">{comment.avatar}</span>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="font-bold text-slate-300">{comment.userName}</span>
                            <span className="text-slate-500">{comment.date}</span>
                          </div>
                          <p className="text-slate-400 text-xs font-sans leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Submission Form */}
                <form onSubmit={handleCommentSubmit} className="flex space-x-2 border-t border-slate-850 pt-4">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Log your community fan comment..."
                    className="flex-1 rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.5 text-xs text-slate-200 focus:border-lime-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!commentInput.trim()}
                    className="rounded-xl bg-lime-400 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    Post
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="h-full rounded-3xl border border-dashed border-slate-800 p-8 text-center flex flex-col items-center justify-center py-20 bg-slate-900/10">
              <Newspaper className="h-8 w-8 text-slate-600 mb-3 animate-pulse" />
              <p className="font-sans text-sm font-bold text-slate-400 uppercase">Select Press Article</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Choose a press report in the left feed list to review fully, like, and share commentaries.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
