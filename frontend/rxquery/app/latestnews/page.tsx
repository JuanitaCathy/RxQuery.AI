"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  source: { name: string };
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=medicine OR pharmaceutical OR medication&language=en&pageSize=8&apiKey=${NEWS_API_KEY}`
        );
        const json = await res.json();
        setArticles(json.articles.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch news", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="p-6 bg-background text-foreground min-h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-6 gap-4">
        <h1 className="text-3xl font-bold text-cyan-200">Latest News on Medicines!</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Search news..."
            className="border-cyan-400 bg-card text-white placeholder:text-cyan-200"
          />
          <Button variant="outline" className="text-cyan-300 border-cyan-400">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {articles.map((article, idx) => (
          <Card
            key={idx}
            className="rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-lg overflow-hidden"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-cyan-200 mb-2">{article.title}</h2>
              <p className="text-sm text-muted-foreground mb-3">
                {article.description?.slice(0, 120)}...
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 text-sm hover:underline"
              >
                🔗 Read More
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}