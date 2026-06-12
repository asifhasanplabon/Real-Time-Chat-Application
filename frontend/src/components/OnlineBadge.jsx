const OnlineBadge = ({ isOnline, lastSeen }) => {
  const formatLastSeen = (date) => {
    if (!date) return "অজানা";
    const now = new Date().getTime();
    const diff = Math.floor((now - new Date(date).getTime()) / 1000);

    if (diff < 60) return "এইমাত্র";
    if (diff < 3600) return `${Math.floor(diff / 60)} মিনিট আগে`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ঘণ্টা আগে`;
    return `${Math.floor(diff / 86400)} দিন আগে`;
  };

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${
          isOnline ? "bg-green-400 animate-pulse" : "bg-gray-300"
        }`}
      />
      <span className="text-xs text-gray-500">
        {isOnline ? "অনলাইন" : `সর্বশেষ: ${formatLastSeen(lastSeen)}`}
      </span>
    </div>
  );
};

export default OnlineBadge;