const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: "flex" }}>
 <aside>Sidebar: Dashboard Nav</aside>
 <section>{children}</section>
 </div>

  )
}

export default DashboardLayout