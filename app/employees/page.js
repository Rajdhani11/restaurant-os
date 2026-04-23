"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/Lib/supabase";
import Link from "next/link";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [rate, setRate] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    const { data } = await supabase.from("employees").select("*");
    setEmployees(data || []);
  }

  async function addEmployee() {
    if (!name || !department || !rate) return;
    
    await supabase.from("employees").insert({
      name,
      department,
      hourly_rate: parseFloat(rate),
    });
    
    setName("");
    setDepartment("");
    setRate("");
    loadEmployees();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 mb-4 block">← Back</Link>
        <h1 className="text-3xl font-bold mb-8">Employees</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Add Employee</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            placeholder="Hourly Rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />
          <button
            onClick={addEmployee}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Add Employee
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Staff List</h2>
          {employees.map((emp) => (
            <div key={emp.id} className="border-b py-3">
              <p className="font-bold">{emp.name}</p>
              <p className="text-sm text-gray-600">{emp.department} • ${emp.hourly_rate}/hr</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}