import { useState } from "react";
import { API_ENDPOINTS } from "../utils/constants";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Auth = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      const endpoint = isLogin ? API_ENDPOINTS.LOGIN : API_ENDPOINTS.REGISTER;

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          };

      const response = await api.post(endpoint, payload);

      const { user, token } = response.data;
      const authenticatedUser = { ...user, token };

      console.log("Auth success:", user);

      login(authenticatedUser);
    } catch (err: any) {
      console.error("Auth error:", err);
      // api utility returns normal axios error
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            2D Metaverse
          </h1>
          <p className="text-gray-600">Enter the virtual world</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              isLogin ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              !isLogin ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
          />
          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : isLogin
              ? "Enter World"
              : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
