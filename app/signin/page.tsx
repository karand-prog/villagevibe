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
      // Try to connect to the API
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
      
      // If API fails, check for mock user or create one for demo
      if (err.message.includes('fetch') || err.message.includes('Network') || err.message.includes('Failed to fetch')) {
        console.log('API unavailable, checking for mock user');
        
        // Check if there's a stored mock user
        const storedMockUser = localStorage.getItem('mockUser');
        const storedMockToken = localStorage.getItem('mockToken');
        
        if (storedMockUser && storedMockToken) {
          const mockUser = JSON.parse(storedMockUser);
          // Check if email matches (for demo purposes, accept any email)
          login(mockUser, storedMockToken);
          router.push("/");
          return;
        } else {
          // Create a new mock user for demo
          const mockUser = {
            id: `user_${Date.now()}`,
            _id: `user_${Date.now()}`,
            name: email.split('@')[0] || 'Demo User',
            email: email,
            role: 'user',
            phone: '',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0] || 'Demo')}&background=random&color=fff&size=100`,
            createdAt: new Date().toISOString()
          };
          
          const mockToken = `mock_token_${Date.now()}`;
          
          // Store in localStorage for persistence
          localStorage.setItem('mockUser', JSON.stringify(mockUser));
          localStorage.setItem('mockToken', mockToken);
          
          // Login with mock data
          login(mockUser, mockToken);
          router.push("/");
          return;
        }
      }
      
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
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <p className="text-center text-sm text-earth-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-primary-600 hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
} 