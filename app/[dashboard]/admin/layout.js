import AdminSidebar from "@/components/layout/AdminSidebar";
import "../../globals.css";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen ">
      <AdminSidebar />  
      
      <div className="flex flex-col flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}