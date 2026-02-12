import { auth } from "@/lib/auth";
import Sidebar from "../components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar session={session as any} />
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1400px] mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
