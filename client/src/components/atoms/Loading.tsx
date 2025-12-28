const Loading = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="relative">
        {/* Outer glowing ring */}
        <div className="h-20 w-20 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin shadow-[0_0_15px_rgba(59,130,246,0.5)]" />

        {/* Inner reverse spinning ring */}
        <div className="absolute inset-2 h-16 w-16 rounded-full border-4 border-purple-500/20 border-b-purple-500 animate-[spin_1.5s_linear_infinite_reverse]" />

        {/* Center pulse */}
        <div className="absolute inset-6 h-8 w-8 bg-blue-500/10 rounded-full animate-pulse border border-blue-500/30" />
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-xl font-black text-white tracking-[0.2em] uppercase animate-pulse">
          Syncing Universe
        </h2>
        <div className="mt-2 flex gap-1 justify-center">
          <div className="h-1 w-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-1 w-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="h-1 w-1 bg-blue-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
