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
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-white/20">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          2D Metaverse
        </h1>
        <p className="text-gray-500 font-medium">Enter the virtual world</p>
      </div>

      <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
        <button
          onClick={() => {
            setIsLogin(true);
            setError("");
          }}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-all ${
            isLogin
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => {
            setIsLogin(false);
            setError("");
          }}
          className={`flex-1 py-2.5 rounded-lg font-bold transition-all ${
            !isLogin
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Register
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-6 text-sm animate-shake">
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
