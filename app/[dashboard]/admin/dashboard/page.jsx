import AnnouncementPanel from "@/components/dashboard/Announcementpanel";
import AttendanceTable from "@/components/dashboard/Attendancetable";
import Birthdays from "@/components/dashboard/Birthdays";
import DashboardCards from "@/components/dashboard/Dashboardcards";
import Inbox from "@/components/dashboard/Inbox";
import PayrollDeadlines from "@/components/dashboard/Payrolldeadlines";
import QuickActions from "@/components/dashboard/Quickactions";
import RecruitmentMetrics from "@/components/dashboard/Recruitmentmetrics";
import TicketsPanel from "@/components/dashboard/Ticketspanel";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <main className=" pt-14 p-6">
        <div className="mb-5">
          <h1 className="text-3xl font-bold text-[#191C1E]">Dashboard</h1>
          <p className="text-[16px] text-[#434655] mt-0.5">
            Good morning, Sarah. Here's what's happening across the organization
            today.
          </p>
        </div>

        <DashboardCards />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="flex flex-col gap-3">
              <QuickActions />
              <RecruitmentMetrics />
              <AttendanceTable />
              <Inbox />
            </div>
          </div>
          <div className="w-full">
            <div className="flex flex-col gap-3">
              <AnnouncementPanel />
              <PayrollDeadlines />
              <TicketsPanel />
              <Birthdays />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
