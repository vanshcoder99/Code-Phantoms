import React, { useState } from 'react';

export default function Community({ darkMode }) {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Aryan',
      avatar: '👨',
      title: 'Started my first SIP today!',
      content: 'Finally took the plunge and started investing. Feeling excited and nervous at the same time.',
      likes: 234,
      comments: 45,
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      author: 'Priya',
      avatar: '👩',
      title: 'Portfolio hit 1 lakh!',
      content: 'After 2 years of consistent investing, my portfolio finally crossed 1 lakh. The power of compounding is real!',
      likes: 567,
      comments: 89,
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      author: 'Rahul',
      avatar: '👨',
      title: 'Best resources for beginners?',
      content: 'Looking for good resources to learn about investing. Any recommendations?',
      likes: 123,
      comments: 34,
      timestamp: '1 day ago'
    }
  ]);

  const [newPost, setNewPost] = useState('');

  const addPost = () => {
    if (newPost.trim()) {
      setPosts([
        {
          id: posts.length + 1,
          author: 'You',
          avatar: '😊',
          title: newPost.split('\n')[0],
          content: newPost,
          likes: 0,
          comments: 0,
          timestamp: 'just now'
        },
        ...posts
      ]);
      setNewPost('');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-20 px-4`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-5xl font-bold mb-12 text-center animate-fadeIn ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          👥 Community
        </h1>

        {/* Create Post */}
        <div className={`p-6 rounded-lg shadow-lg mb-8 animate-slideUp ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Share Your Journey
          </h2>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind? Share your investing experience..."
            className={`w-full p-4 rounded-lg border-2 mb-4 ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:border-blue-500`}
            rows="4"
          />
          <button
            onClick={addPost}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition"
          >
            Post
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post, idx) => (
            <div
              key={post.id}
              className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition animate-slideUp ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{post.avatar}</div>
                <div>
                  <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {post.author}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {post.timestamp}
                  </p>
                </div>
              </div>

              {/* Content */}
              <h4 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {post.title}
              </h4>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {post.content}
              </p>

              {/* Actions */}
              <div className="flex gap-6 pt-4 border-t border-gray-600">
                <button className={`flex items-center gap-2 transition hover:text-blue-500 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  👍 {post.likes}
                </button>
                <button className={`flex items-center gap-2 transition hover:text-blue-500 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  💬 {post.comments}
                </button>
                <button className={`flex items-center gap-2 transition hover:text-blue-500 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  📤 Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className={`p-6 rounded-lg text-center shadow-lg animate-slideUp ${
            darkMode ? 'bg-gradient-to-br from-blue-900 to-blue-800' : 'bg-gradient-to-br from-blue-50 to-blue-100'
          }`}>
            <p className="text-4xl font-bold text-blue-500 mb-2">12.5K</p>
            <p className={`${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Active Members</p>
          </div>

          <div className={`p-6 rounded-lg text-center shadow-lg animate-slideUp ${
            darkMode ? 'bg-gradient-to-br from-green-900 to-green-800' : 'bg-gradient-to-br from-green-50 to-green-100'
          }`}>
            <p className="text-4xl font-bold text-green-500 mb-2">3.2K</p>
            <p className={`${darkMode ? 'text-green-300' : 'text-green-700'}`}>Posts This Month</p>
          </div>

          <div className={`p-6 rounded-lg text-center shadow-lg animate-slideUp ${
            darkMode ? 'bg-gradient-to-br from-purple-900 to-purple-800' : 'bg-gradient-to-br from-purple-50 to-purple-100'
          }`}>
            <p className="text-4xl font-bold text-purple-500 mb-2">98%</p>
            <p className={`${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>Positive Feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
}
