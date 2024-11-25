// src/components/Layout.jsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Si es la página principal, solo renderiza el contenido sin el sidebar
  if (isHomePage) {
    return <>{children}</>
  }

  // Para cualquier otra ruta, renderiza el layout completo con sidebar
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}