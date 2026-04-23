"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Restaurant OS</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <Link href="/dashboard" className="p-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p>Today overview</p>
          </Link>
          
          <Link href="/employees" className="p-6 bg-green-500 text-white rounded-lg hover:bg-green-600">
            <h2 className="text-2xl font-bold">Employees</h2>
            <p>Manage staff</p>
          </Link>
          
          <Link href="/shifts" className="p-6 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
            <h2 className="text-2xl font-bold">Shifts</h2>
            <p>Track hours</p>
          </Link>
          
          <Link href="/tips" className="p-6 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            <h2 className="text-2xl font-bold">Tips</h2>
            <p>Enter & distribute</p>
          </Link>
        </div>
      </div>
    </div>
  );
}