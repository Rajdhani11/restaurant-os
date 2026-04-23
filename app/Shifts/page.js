"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { syncToCloud } from "@/lib/sync";
import Link from "next/link";

export default function Shifts() {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    loadEmployees();
    loadShifts();
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  async function loadEmployees() {
    const { data } = await supabase.from("employees").select("*");
    setEmployees(data || []);
  }

  async function loadShifts() {
    const { data } = await supabase.from("shifts").select("*, employees(name)");
    setShifts(data || []);
  }

  async function addShift() {
    if (!selectedEmployee || !date || !startTime || !endTime) return;

    const shiftData = {
      employee_id: selectedEmployee,
      shift_date: date,
      start_time: startTime,
      end_time: endTime,
    };

    await syncToCloud("shifts", shiftData);
    
    setSelectedEmployee("");
    setStartTime("");
    setEndTime("");
    loadShifts();
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
        <h1 className="text-3xl font-bold mb-8">Shifts</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Add Shift</h2>
          
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />

          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />

          <button
            onClick={addShift}
            className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
          >
            Add Shift
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Shifts</h2>
          {shifts.map((shift) => (
            <div key={shift.id} className="border-b py-3">
              <p className="font-bold">{shift.employees?.name}</p>
              <p className="text-sm text-gray-600">
                {shift.shift_date} • {shift.start_time} - {shift.end_time}
                <span className="ml-2 font-semibold">
                  ({calculateHours(shift.start_time, shift.end_time)} hrs)
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}