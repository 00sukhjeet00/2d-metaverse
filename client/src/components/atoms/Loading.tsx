const Loading = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="relative">
        {/* Outer glowing ring */}
        <div className="h-20 w-20 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin shadow-[0_0_15px_rgba(168,85,247,0.5)]" />

        {/* Inner reverse spinning ring */}
        <div className="absolute inset-2 h-16 w-16 rounded-full border-4 border-fuchsia-500/20 border-b-fuchsia-500 animate-[spin_1.5s_linear_infinite_reverse]" />

        {/* Center pulse */}
        <div className="absolute inset-6 h-8 w-8 bg-purple-500/10 rounded-full animate-pulse border border-purple-500/30" />
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-xl font-black text-white tracking-[0.2em] uppercase animate-pulse">
          Syncing Universe
        </h2>
        <div className="mt-2 flex gap-1 justify-center">
          <div className="h-1 w-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-1 w-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="h-1 w-1 bg-purple-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
