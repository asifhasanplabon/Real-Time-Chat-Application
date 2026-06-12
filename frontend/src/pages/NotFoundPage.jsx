import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-7xl font-bold text-blue-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 font-medium mb-2">পেজটি পাওয়া যায়নি</p>
      <p className="text-sm text-gray-400 mb-8">
        আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে বা কখনো ছিল না।
      </p>
      <button
        onClick={() => navigate("/chat")}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition"
      >
        হোমে ফিরে যান
      </button>
    </div>
  );
};

export default NotFoundPage;