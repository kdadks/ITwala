import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const AdminSidebar = () => {
  const router = useRouter();
  
  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊', tooltip: 'Overview and quick actions' },
    { href: '/admin/courses', label: 'Courses', icon: '📚', tooltip: 'Manage courses and curriculum' },
    { href: '/admin/students', label: 'Students', icon: '👥', tooltip: 'View and manage students' },
    { href: '/admin/instructors', label: 'Instructors', icon: '👨‍🏫', tooltip: 'Manage course instructors' },
    { href: '/admin/progress', label: 'Progress', icon: '📋', tooltip: 'Manage student progress' },
    { href: '/admin/attendance', label: 'Attendance', icon: '✓', tooltip: 'Mark student attendance' },
    { href: '/admin/content', label: 'Content', icon: '📝', tooltip: 'Manage website content' },
    { href: '/admin/categories', label: 'Categories', icon: '🏷️', tooltip: 'Manage course categories' },
    { href: '/admin/invoices', label: 'Invoices', icon: '🧾', tooltip: 'Generate and manage invoices' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈', tooltip: 'View site analytics' },
    { href: '/admin/revenue', label: 'Revenue', icon: '💰', tooltip: 'Track payments and revenue' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️', tooltip: 'Configure admin settings' }
  ];

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <div className="px-4 py-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <div
                  className={`flex items-center p-3 text-gray-700 rounded-lg transition-colors group relative ${
                    router.pathname === item.href 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center w-full">
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.tooltip && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {item.tooltip}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;