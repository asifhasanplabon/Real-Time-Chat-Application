import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useChat from "../hooks/useChat.js";
import useAuth from "../hooks/useAuth.js";
import useSocket from "../hooks/useSocket.js";
import NewChatModal from "./NewChatModal.jsx";
import { formatSidebarTime } from "../utils/formatTime.js";

const Sidebar = () => {
  const navigate = useNavigate();
  const { rooms, roomsLoading, selectedRoom, setSelectedRoom } = useChat();
  const { user, logout } = useAuth();
  const { onlineUsers } = useSocket();
  const [search, setSearch] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getOtherMember = (room) =>
    room?.members?.find((m) => m._id?.toString() !== user?._id?.toString());

  const getRoomDisplayName = (room) => {
    if (room.roomType === "group") return room.name || "Group Chat";
    return getOtherMember(room)?.name || "Unknown";
  };

  const getRoomAvatar = (room) => {
    if (room.roomType === "group") return room.groupAvatar || null;
    return getOtherMember(room)?.avatar || null;
  };

  const isRoomOnline = (room) => {
    if (room.roomType === "group") return false;
    const other = getOtherMember(room);
    return other ? onlineUsers.includes(other._id?.toString()) : false;
  };

  const getLastMessagePreview = (lastMessage) => {
    if (!lastMessage) return "মেসেজ শুরু করুন";
    if (lastMessage.isDeleted) return "মেসেজটি মুছে ফেলা হয়েছে";
    if (lastMessage.messageType === "image") return "📷 ছবি";
    if (lastMessage.messageType === "file") return "📎 ফাইল";
    return lastMessage.text || "";
  };

  const filteredRooms = useMemo(() => {
    if (!search.trim()) return rooms;
    const q = search.toLowerCase();
    return rooms.filter((r) => getRoomDisplayName(r).toLowerCase().includes(q));
  }, [rooms, search]);

  const handleLogout = async () => {
    setShowMenu(false);
    try {
      await logout();
      navigate("/login");
      toast.success("লগআউট সফল হয়েছে");
    } catch {
      toast.error("লগআউট ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="flex flex-col h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate("/profile")} className="relative flex-shrink-0 group" title="প্রোফাইল দেখুন">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm overflow-hidden ring-2 ring-transparent group-hover:ring-blue-300 transition">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase() || "?"
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-white" />
          </button>
          <span className="font-semibold text-gray-800 text-sm">Messages</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={() => setShowNewChat(true)} className="p-2 rounded-xl hover:bg-blue-50 text-blue-600 transition" title="নতুন চ্যাট">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <div className="relative">
            <button onClick={() => setShowMenu((v) => !v)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 w-44 overflow-hidden">
                  <button onClick={() => { navigate("/profile"); setShowMenu(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    প্রোফাইল
                  </button>
                  <button onClick={() => { setShowNewChat(true); setShowMenu(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    নতুন গ্রুপ
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    লগআউট
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="চ্যাট খুঁজুন..." className="bg-transparent text-sm flex-1 outline-none text-gray-700 placeholder-gray-400" />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto">
        {roomsLoading ? (
          <div className="flex flex-col gap-1 px-4 pt-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 py-3 animate-pulse">
                <div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            {search ? (
              <p className="text-sm text-gray-400">"{search}" নামে কোনো চ্যাট নেই</p>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-500 mb-1">কোনো চ্যাট নেই</p>
                <p className="text-xs text-gray-400 mb-4">নতুন কারো সাথে চ্যাট শুরু করুন</p>
                <button onClick={() => setShowNewChat(true)} className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition">
                  + নতুন চ্যাট
                </button>
              </>
            )}
          </div>
        ) : (
          <ul>
            {filteredRooms.map((room) => {
              const isActive = selectedRoom?._id?.toString() === room._id?.toString();
              const online = isRoomOnline(room);
              const avatar = getRoomAvatar(room);
              const displayName = getRoomDisplayName(room);
              const lastMsg = getLastMessagePreview(room.lastMessage);
              const msgTime = room.lastMessage?.createdAt || room.updatedAt;
              const isGroup = room.roomType === "group";

              return (
                <li key={room._id}>
                  <button
                    onClick={() => setSelectedRoom(room)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition text-left ${isActive ? "bg-blue-50 border-r-2 border-blue-600" : "hover:bg-gray-50"}`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold overflow-hidden ${isGroup ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {avatar ? <img src={avatar} alt={displayName} className="w-full h-full object-cover" /> : displayName[0]?.toUpperCase() || "?"}
                      </div>
                      {!isGroup && online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white" />}
                      {isGroup && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-purple-500 rounded-full ring-2 ring-white flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className={`text-sm font-medium truncate ${isActive ? "text-blue-700" : "text-gray-800"}`}>{displayName}</p>
                        <span className="text-xs text-gray-400 flex-shrink-0">{formatSidebarTime(msgTime)}</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{lastMsg}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} />}
    </div>
  );
};

export default Sidebar;
