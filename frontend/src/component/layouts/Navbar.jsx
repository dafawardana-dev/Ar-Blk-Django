// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Sistem Arsip Dokumen BLK</h2>
        <Link
          to="/"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <span>Logout</span>
        </Link>
      </div>
    </header>
  );
}