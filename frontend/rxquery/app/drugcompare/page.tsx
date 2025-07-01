"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

interface Drug {
  drug_name: string;
  description: string;
  category: string;
  usage: string;
}

export default function DrugComparePage() {
  const [data, setData] = useState<Drug[]>([]);

  useEffect(() => {
    fetch("/data/medicine_details.csv")
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, { header: true });
        const clean = parsed.data.filter((row: any) => row.drug_name && row.category);
        setData(clean.slice(0, 20) as Drug[]); // show 20 drugs max
      });
  }, []);

  // Count number of drugs per category
  const categoryCounts = data.reduce((acc: Record<string, number>, drug) => {
    const cat = drug.category.trim();
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(categoryCounts).map(([cat, count]) => ({
    category: cat,
    count,
  }));

  return (
    <div className="p-6 bg-background text-foreground min-h-screen">
        <Navbar />
      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-6">
        <h1 className="text-3xl font-bold text-cyan-100">💊 Drug Comparison~</h1>
        <Button variant="outline" className="flex items-center gap-2 border-cyan-400 text-cyan-300">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Chart */}
      <Card className="mb-8 p-6 rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-foreground">📊 Drugs by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="category" tick={{ fill: "#ccc" }} />
            <YAxis tick={{ fill: "#ccc" }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#06b6d4" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Table */}
      <Card className="p-6 rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-cyan-200">📋 Drug Information Table</h2>
          <input
            type="text"
            placeholder="Search drugs..."
            className="px-3 py-2 rounded-lg border border-cyan-400 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-400"
            style={{ minWidth: 200 }}
            disabled
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="text-cyan-100 border-b border-border">
                <th className="px-4 py-2">Drug Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Usage</th>
                <th className="px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {data.map((drug, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-muted/20">
                  <td className="px-4 py-3 text-cyan-300 font-medium">{drug.drug_name}</td>
                  <td className="px-4 py-3">{drug.category || "N/A"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {drug.usage?.split(",").slice(0, 3).map((u, i) => (
                        <Badge key={i} variant="secondary" className="bg-purple-700/30 text-purple-200 whitespace-normal max-w-[180px]">
                          {u.trim()}
                        </Badge>

                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-3 text-muted-foreground">{drug.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}