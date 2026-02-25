import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  FolderTree,
  Users,
  GraduationCap,
  ClipboardList,
  Calendar,
  DollarSign,
  FileSpreadsheet,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface MenuItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const AdminSidebar = () => {
  const router = useRouter();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    'Overview',
    'Course Management',
    'User Management',
    'Academic Tracking',
    'Financial',
    'Analytics & Reports',
    'System'
  ]);

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupTitle)
        ? prev.filter(g => g !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const menuGroups: MenuGroup[] = [
    {
      title: 'Overview',
      items: [
        { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Course Management',
      items: [
        { href: '/admin/courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
        { href: '/admin/content', label: 'Content', icon: <FileText className="w-4 h-4" /> },
        { href: '/admin/categories', label: 'Categories', icon: <FolderTree className="w-4 h-4" /> }
      ]
    },
    {
      title: 'User Management',
      items: [
        { href: '/admin/students', label: 'Students', icon: <Users className="w-4 h-4" /> },
        { href: '/admin/instructors', label: 'Instructors', icon: <GraduationCap className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Academic Tracking',
      items: [
        { href: '/admin/progress', label: 'Progress', icon: <ClipboardList className="w-4 h-4" /> },
        { href: '/admin/attendance', label: 'Attendance', icon: <Calendar className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Financial',
      items: [
        { href: '/admin/revenue', label: 'Revenue', icon: <DollarSign className="w-4 h-4" /> },
        { href: '/admin/invoices', label: 'Invoices', icon: <FileSpreadsheet className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Analytics & Reports',
      items: [
        { href: '/admin/analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> }
      ]
    },
    {
      title: 'System',
      items: [
        { href: '/admin/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
      ]
    }
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return router.pathname === '/admin';
    }
    return router.pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
      <nav className="p-3">
        {menuGroups.map((group, groupIndex) => {
          const isExpanded = expandedGroups.includes(group.title);

          return (
            <div key={groupIndex} className="mb-4">
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
              >
                <span>{group.title}</span>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>

              {isExpanded && (
                <ul className="mt-1 space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>
                        <div
                          className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                            isActive(item.href)
                              ? 'bg-primary-50 text-primary-700 shadow-sm'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <span className={isActive(item.href) ? 'text-primary-600' : 'text-gray-400'}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;