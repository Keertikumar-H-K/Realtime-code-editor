const Docs = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-16">
      <h1 className="text-5xl font-bold mb-8">Documentation 📚</h1>

      <div className="max-w-4xl space-y-6">
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold">Getting Started</h2>
          <p className="text-gray-400">
            Create a room, invite users, and start coding instantly.
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold">Features</h2>
          <p className="text-gray-400">
            Real-time editing, chat, and code execution supported.
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold">API Usage</h2>
          <p className="text-gray-400">
            Integrate backend APIs for custom workflows.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Docs;