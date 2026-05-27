import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[#050b14] text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden px-4 py-8 md:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
