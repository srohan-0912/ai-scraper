"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSummary("");
    setTitle("");

    if (!url.trim()) {
      setError("Please enter a webpage URL.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setTitle(data.title);
      setSummary(data.summary);
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            AI Web Scraper & Summarizer
          </h1>

          <p className="mt-3 text-gray-600">
            Enter a webpage URL and get an AI-generated summary in seconds.
          </p>
        </div>

        {/* Input Card */}
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="url"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Webpage URL
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
              />

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Summarizing..." : "Summarize"}
              </button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        {summary && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-500">
                Page Title
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                {title}
              </h2>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                AI Summary
              </h3>

              <div className="whitespace-pre-line leading-7 text-gray-700">
                {summary}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Built with Next.js, Cheerio, and Groq AI
        </p>
      </div>
    </main>
  );
}