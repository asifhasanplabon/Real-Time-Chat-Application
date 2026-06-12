const UserAvatar = ({ user, size = "md", showBadge = false }) => {
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  return (
    <div className="relative inline-flex shrink-0">
      <div
        className={`${sizes[size]} rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold overflow-hidden`}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          user?.name?.[0]?.toUpperCase() || "?"
        )}
      </div>

      {showBadge && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white ${
            user?.isOnline ? "bg-green-400" : "bg-gray-300"
          } ${size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5"}`}
        />
      )}
    </div>
  );
};

export default UserAvatar;