"use client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
   <div className='min-h-screen flex flex-col '>
      <main className='flex-grow pt-20 '>{children}</main>
   </div>
  );
}