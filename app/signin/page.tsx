"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/components/AuthContext'

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      console.log('Attempting login to:', `${apiUrl}/auth/login`);
      
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      console.log('Login response:', data);
      
      if (!res.ok) {
        throw new Error(data.message || data.error || "Login failed");
      }
      
      if (data.user && data.token) {
        login(data.user, data.token);
        router.push("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-earth-50">
      <form
        onSubmit={handleSubmit}
        className="card p-8 w-full max-w-md space-y-6 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}
        <div>
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-earth-600">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" disabled={loading} />
            <span>Remember me</span>
          </label>
          <a href="#" className="text-primary-600 hover:underline">Forgot password?</a>
        </div>
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <div className="text-center text-sm mt-2">
          Don&apos;t have an account? <a href="/signup" className="text-primary-600 font-medium">Sign Up</a>
        </div>
      </form>
    </div>
  );
} 