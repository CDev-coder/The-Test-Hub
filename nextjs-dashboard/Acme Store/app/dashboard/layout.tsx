import SideNav from "@/app/ui/dashboard/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  /// layout.tsx always sets up the page if detected. layout.tsx is like a wrapper so it prepares to hold whatever content in the page.tsx
  // This is useful if the multiple pages in a particular path home/file1 & homelfiel2. This one layout will controll how to position content for each file1 & file2.
  ///https://nextjs.org/learn/dashboard-app/creating-layouts-and-pages
  return (
    <div
      className="flex h-screen flex-col md:flex-row md:overflow-hidden"
      id="nested_layout_dashboardlayout.tsx"
    >
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
