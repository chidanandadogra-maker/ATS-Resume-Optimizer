import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-h-screen lg:ml-64">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;