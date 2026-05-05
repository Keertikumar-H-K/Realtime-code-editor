const Blog = () => {
  const posts = [
    { title: "How to Code Faster", date: "July 2026" },
    { title: "Best Practices for Teams", date: "June 2026" },
    { title: "Real-time Apps Explained", date: "May 2026" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-12">Blog ✍️</h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {posts.map((post, i) => (
          <div
            key={i}
            className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p className="text-gray-400">{post.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;