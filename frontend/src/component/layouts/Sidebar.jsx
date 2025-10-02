// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  Edit,
  Trash2,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const NavItem = ({ icon: Icon, label, to }) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm'
            : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col p-4 shadow-sm sticky top-0 h-screen">
      <div className="p-2 mb-8">
        <h1 className="text-2xl font-extrabold text-indigo-800 tracking-wide">Arsip BLK</h1>
      </div>

      <nav>
        <ul className="space-y-2">
          <li><NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" /></li>
          <li><NavItem icon={Users} label="User Management" to="/users" /></li>
          <li><NavItem icon={Edit} label="Form Arsip" to="/arsip" /></li>
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-200">
        <NavItem icon={Settings} label="Settings" to="/settings" />
      </div>
    </aside>
  );
};

export default Sidebar;