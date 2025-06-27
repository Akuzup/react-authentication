import React, { ReactNode } from 'react'
import Navigation from './Navigation'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="page-container">
      <Navigation />
      <main className="content-container py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
