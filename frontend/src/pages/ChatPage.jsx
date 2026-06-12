import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import MessageList from "../components/MessageList.jsx";
import MessageInput from "../components/MessageInput.jsx";
import TypingIndicator from "../components/TypingIndicator.jsx";
import useChat from "../hooks/useChat.js";
import useMessages from "../hooks/useMessages.js";
import useAuth from "../hooks/useAuth.js";
import useSocket from "../hooks/useSocket.js";

const ChatPage = () => {
  const navigate = useNavigate();
  const { selectedRoom, typingUsers } = useChat();
  const { messages, sendMessage, loading } = useMessages(selectedRoom?._id);
  const { user } = useAuth();
  const { onlineUsers } = useSocket();

  const getOtherMember = (room) =>
    room?.members?.find((m) => m._id?.toString() !== user?._id?.toString());

  const otherMember =
    selectedRoom?.roomType === "private" ? getOtherMember(selectedRoom) : null;

  const isOnline = otherMember
    ? onlineUsers.includes(otherMember._id?.toString())
    : false;

  const currentTypingUsers = selectedRoom
    ? (typingUsers[selectedRoom._id] || []).map((t) => t.userName)
    : [];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 flex-shrink-0 bg-white border-r border-gray-200">
        <Sidebar />
      </aside>

      {/* Chat area */}
      <main className="flex flex-col flex-1 overflow-hidden">
        {selectedRoom ? (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between gap-3 px-5 py-3 bg-white border-b border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm overflow-hidden">
                    {selectedRoom.roomType === "group" ? (
                      selectedRoom.groupAvatar ? (
                        <img src={selectedRoom.groupAvatar} className="w-full h-full rounded-full object-cover" alt="" />
                      ) : (
                        <span className="text-purple-700">{selectedRoom.name?.[0]?.toUpperCase() || "G"}</span>
                      )
                    ) : otherMember?.avatar ? (
                      <img src={otherMember.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                    ) : (
                      otherMember?.name?.[0]?.toUpperCase() || "?"
                    )}
                  </div>
                  {selectedRoom.roomType === "private" && isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    {selectedRoom.roomType === "group"
                      ? selectedRoom.name || "Group Chat"
                      : otherMember?.name || "Unknown"}
                  </p>
                  <p className={`text-xs ${isOnline ? "text-green-500" : "text-gray-400"}`}>
                    {selectedRoom.roomType === "group"
                      ? `${selectedRoom.members?.length || 0} জন সদস্য`
                      : isOnline
                      ? "অনলাইন"
                      : "অফলাইন"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/profile")}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                title="প্রোফাইল"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50">
              <MessageList messages={messages} loading={loading} />
            </div>

            {/* Typing indicator */}
            {currentTypingUsers.length > 0 && (
              <div className="px-5 py-1 bg-gray-50">
                <TypingIndicator typingUsers={currentTypingUsers} />
              </div>
            )}

            {/* Message input */}
            <div className="px-5 py-3 bg-white border-t border-gray-200">
              <MessageInput roomId={selectedRoom._id} onSend={sendMessage} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-base font-medium text-gray-500 mb-1">চ্যাট বেছে নিন</p>
            <p className="text-sm text-gray-400">বাম দিক থেকে একটি চ্যাট সিলেক্ট করুন</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
