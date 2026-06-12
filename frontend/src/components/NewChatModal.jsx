import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { searchUsers } from "../services/user.service.js";
import { createRoom } from "../services/message.service.js";
import useChat from "../hooks/useChat.js";

const NewChatModal = ({ onClose }) => {
  const { addRoom, setSelectedRoom } = useChat();
  const [tab, setTab] = useState("dm");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const data = await searchUsers(q);
      setResults(data.users || []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 350);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const startDM = async (userId) => {
    setCreating(true);
    try {
      const data = await createRoom({ memberIds: [userId], roomType: "private" });
      addRoom(data.room);
      setSelectedRoom(data.room);
      toast.success("চ্যাট শুরু হয়েছে");
      onClose();
    } catch (err) {
      toast.error(err.message || "চ্যাট শুরু করা যায়নি");
    } finally {
      setCreating(false);
    }
  };

  const toggleMember = (u) => {
    setSelectedMembers((prev) => {
      const exists = prev.find((m) => m._id === u._id);
      return exists ? prev.filter((m) => m._id !== u._id) : [...prev, u];
    });
  };

  const createGroup = async () => {
    if (!groupName.trim()) return toast.error("গ্রুপের নাম দিন");
    if (selectedMembers.length < 1) return toast.error("কমপক্ষে ১ জন সদস্য যোগ করুন");

    setCreating(true);
    try {
      const data = await createRoom({
        name: groupName.trim(),
        memberIds: selectedMembers.map((m) => m._id),
        roomType: "group",
      });
      addRoom(data.room);
      setSelectedRoom(data.room);
      toast.success("গ্রুপ তৈরি হয়েছে!");
      onClose();
    } catch (err) {
      toast.error(err.message || "গ্রুপ তৈরি করা যায়নি");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 text-base">নতুন চ্যাট</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {[
            { key: "dm", label: "Direct Message" },
            { key: "group", label: "নতুন গ্রুপ" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setQuery(""); setResults([]); }}
              className={`flex-1 py-3 text-sm font-medium transition border-b-2 ${
                tab === key
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {/* Group name */}
          {tab === "group" && (
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="গ্রুপের নাম..."
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {/* Selected members chips */}
          {tab === "group" && selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedMembers.map((m) => (
                <span
                  key={m._id}
                  className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium"
                >
                  {m.name}
                  <button
                    onClick={() => toggleMember(m)}
                    className="hover:text-red-500 transition"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search input */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..."
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            )}
            {!searching && query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Results list */}
          <div className="max-h-60 overflow-y-auto -mx-1 px-1 space-y-0.5">
            {!query.trim() && (
              <p className="text-center text-sm text-gray-400 py-8">
                নাম বা ইমেইল লিখুন খোঁজার জন্য
              </p>
            )}
            {query.trim() && !searching && results.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">কোনো ইউজার পাওয়া যায়নি</p>
            )}
            {results.map((u) => {
              const isSelected = !!selectedMembers.find((m) => m._id === u._id);
              return (
                <button
                  key={u._id}
                  onClick={() => tab === "dm" ? startDM(u._id) : toggleMember(u)}
                  disabled={creating && tab === "dm"}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left ${
                    isSelected
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm overflow-hidden">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                      ) : (
                        u.name?.[0]?.toUpperCase()
                      )}
                    </div>
                    {u.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-white" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>

                  {/* Group checkbox */}
                  {tab === "group" && (
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Create group button */}
          {tab === "group" && (
            <button
              onClick={createGroup}
              disabled={creating || !groupName.trim() || selectedMembers.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  তৈরি হচ্ছে...
                </span>
              ) : (
                `গ্রুপ তৈরি করুন${selectedMembers.length > 0 ? ` (${selectedMembers.length} জন)` : ""}`
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
