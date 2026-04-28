import OperationNavbar from "@/components/layout/OperationNavbar";

export default function OperationLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <OperationNavbar />
      <main>{children}</main>
    </div>
  );
}