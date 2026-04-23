"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { syncToCloud } from "@/lib/sync";
import Link from "next/link";

export default function Tips() {
  const [tips, setTips] = useState([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    loadTips();
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  async function loadTips() {
    const { data } = await supabase.from("tips").select("*").order('date', { ascending: false });
    setTips(data || []);
  }

  async function addTip() {
    if (!amount || !date) return;

    const tipData = {
      date: date,
      total_amount: parseFloat(amount),
    };

    await syncToCloud("tips", tipData);
    
    setAmount("");
    loadTips();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 mb-4 block">← Back</Link>
        <h1 className="text-3xl font-bold mb-8">Tips</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Enter Tips</h2>
          
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />

          <input
            type="number"
            placeholder="Total Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />

          <button
            onClick={addTip}
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
          >
            Add Tips
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Tips History</h2>
          {tips.map((tip) => (
            <div key={tip.id} className="border-b py-3 flex justify-between">
              <p className="text-gray-600">{tip.date}</p>
              <p className="font-bold text-green-600">${tip.total_amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}