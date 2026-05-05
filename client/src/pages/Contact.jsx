const Contact = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Contact Us 📩</h1>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 rounded bg-slate-800 border border-white/10"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 rounded bg-slate-800 border border-white/10"
          />
          <textarea
            placeholder="Your Message"
            className="w-full p-3 rounded bg-slate-800 border border-white/10"
            rows="4"
          />
          <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;