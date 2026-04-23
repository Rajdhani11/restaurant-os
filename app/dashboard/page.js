"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Dashboard() {
  const [todayShifts, setTodayShifts] = useState([]);
  const [todayTips, setTodayTips] = useState(0);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const today = new Date().toISOString().split('T')[0];

    // Today's shifts
    const { data: shifts } = await supabase
      .from("shifts")
      .select("*, employees(name)")
      .eq("shift_date", today);
    setTodayShifts(shifts || []);

    // Today's tips
    const { data: tips } = await supabase
      .from("tips")
      .select("total_amount")
      .eq("date", today);
    const total = tips?.reduce((sum, t) => sum + parseFloat(t.total_amount), 0) || 0;
    setTodayTips(total);

    // Check alerts
    checkAlerts(shifts || []);
  }

  function checkAlerts(shifts) {
    const newAlerts = [];
    
    shifts.forEach((shift) => {
      const hours = calculateHours(shift.start_time, shift.end_time);
      if (hours > 10) {
        newAlerts.push(`⚠️ ${shift.employees?.name} worked ${hours} hours (overtime)`);
      }
    });

    setAlerts(newAlerts);
  }

  function calculateHours(start, end) {
    const startDate = new Date(`1970-01-01T${start}`);
    const endDate = new Date(`1970-01-01T${end}`);
    return ((endDate - startDate) / 3600000).toFixed(2);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 mb-4 block">← Back</Link>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="bg-red-100 border border-red-400 p-4 rounded-lg mb-6">
            <h2 className="font-bold text-red-800 mb-2">Alerts</h2>
            {alerts.map((alert, i) => (
              <p key={i} className="text-red-700">{alert}</p>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">Today's Shifts</h3>
            <p className="text-3xl font-bold">{todayShifts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">Today's Tips</h3>
            <p className="text-3xl font-bold text-green-600">${todayTips.toFixed(2)}</p>
          </div>
        </div>

        {/* Today's Shifts */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Today's Shifts</h2>
          {todayShifts.length === 0 ? (
            <p className="text-gray-500">No shifts today</p>
          ) : (
            todayShifts.map((shift) => (
              <div key={shift.id} className="border-b py-3">
                <p className="font-bold">{shift.employees?.name}</p>
                <p className="text-sm text-gray-600">
                  {shift.start_time} - {shift.end_time}
                  <span className="ml-2">
                    ({calculateHours(shift.start_time, shift.end_time)} hrs)
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}