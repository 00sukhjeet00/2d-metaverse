import { useState } from "react";
import { API_ENDPOINTS } from "../../utils/constants";
import { api } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../atoms/Button";
import FormField from "../molecules/FormField";

const AuthForm = () => {
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
      login(authenticatedUser);
    } catch (err: any) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-gray-900/60 rounded-2xl shadow-[0_0_50px_-12px_rgba(168,85,247,0.2)] p-8 backdrop-blur-xl border border-gray-800/50">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2 tracking-tight">
          2D Metaverse
        </h1>
        <p className="text-gray-400 font-medium tracking-wide">
          Enter the virtual world
        </p>
      </div>

      <div className="flex p-1 bg-black/40 rounded-xl mb-8 border border-gray-800/50">
        <button
          onClick={() => {
            setIsLogin(true);
            setError("");
          }}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-all duration-300 ${
            isLogin
              ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => {
            setIsLogin(false);
            setError("");
          }}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-all duration-300 ${
            !isLogin
              ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Register
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 rounded-r-lg mb-6 text-sm animate-shake backdrop-blur-md">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {!isLogin && (
          <FormField
            label="Username"
            placeholder="Choose a cool username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        )}
        <FormField
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <FormField
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <Button
          onClick={handleAuth}
          loading={loading}
          className="w-full py-3.5 mt-2"
        >
          {isLogin ? "Enter World" : "Create Account"}
        </Button>
      </div>
    </div>
  );
};

export default AuthForm;
