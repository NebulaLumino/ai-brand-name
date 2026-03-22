"use client";
import { useState } from "react";

export default function BrandNamePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, type: "brand-name" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-pink-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">✨ AI Brand Name Generator</h1>
          <p className="text-gray-600 text-lg">Generate 20+ brand name options with domain availability notes</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Brand Information</label>
          <textarea
            className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition-all"
            rows={8}
            placeholder={`Describe your brand:\n\n1. Product or Service Description:\n2. Target Market / Audience:\n3. Naming Style Preference (playful, corporate, modern, minimalist, edgy, warm, premium):\n4. Industry:\n5. Any words to avoid or include:\n6. Do you prefer short names, compound words, or made-up words?`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="mt-4 w-full bg-fuchsia-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "🔄 Generating Names..." : "🚀 Generate Brand Names"}
          </button>
          {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
        </div>

        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Brand Name Options</h2>
            <pre className="bg-gray-50 rounded-xl p-4 text-sm overflow-x-auto whitespace-pre-wrap text-gray-800">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
