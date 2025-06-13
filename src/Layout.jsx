import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { routes } from '@/config/routes';
import ApperIcon from '@/components/ApperIcon';

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getCurrentRoute = () => {
    return routes.find(route => route.path === location.pathname);
  };

  const currentRoute = getCurrentRoute();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Desktop Layout */}
      <div className="hidden md:flex h-full">
        {/* Sidebar */}
        <aside className="w-64 bg-surface-100 flex flex-col border-r border-surface-200 z-40">
          {/* Logo */}
          <div className="p-6 border-b border-surface-200">
            <h1 className="text-2xl font-serif text-primary">ZenScape</h1>
            <p className="text-sm text-secondary mt-1">Digital Zen Garden</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {routes.map((route) => (
                <li key={route.id}>
                  <NavLink
                    to={route.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg transition-all duration-400 group ${
                        isActive
                          ? 'bg-primary/10 text-primary shadow-zen'
                          : 'text-secondary hover:bg-surface-200 hover:text-primary'
                      }`
                    }
                  >
                    <ApperIcon 
                      name={route.icon} 
                      className="w-5 h-5 mr-3 transition-transform duration-400 group-hover:scale-110" 
                    />
                    <span className="font-medium">{route.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-surface-200">
            <p className="text-xs text-secondary text-center">
              Find peace in creation
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-full">
        {/* Mobile Header */}
        <header className="flex-shrink-0 bg-surface-100 border-b border-surface-200 px-4 py-3 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-serif text-primary">ZenScape</h1>
              <p className="text-xs text-secondary">
                {currentRoute?.label || 'Digital Zen Garden'}
              </p>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-surface-200 text-primary hover:bg-surface-300 transition-colors duration-400"
            >
              <ApperIcon name={mobileMenuOpen ? 'X' : 'Menu'} className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-50"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-surface-100 border-r border-surface-200 z-50 flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="p-6 border-b border-surface-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-serif text-primary">ZenScape</h1>
                    <p className="text-sm text-secondary mt-1">Digital Zen Garden</p>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-secondary hover:text-primary transition-colors duration-400"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {routes.map((route) => (
                    <li key={route.id}>
                      <NavLink
                        to={route.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center px-4 py-3 rounded-lg transition-all duration-400 group ${
                            isActive
                              ? 'bg-primary/10 text-primary shadow-zen'
                              : 'text-secondary hover:bg-surface-200 hover:text-primary'
                          }`
                        }
                      >
                        <ApperIcon 
                          name={route.icon} 
                          className="w-5 h-5 mr-3 transition-transform duration-400 group-hover:scale-110" 
                        />
                        <span className="font-medium">{route.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="flex-shrink-0 bg-surface-100 border-t border-surface-200 px-4 py-2 z-40">
          <div className="flex justify-around">
            {routes.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-400 ${
                    isActive
                      ? 'text-primary'
                      : 'text-secondary hover:text-primary'
                  }`
                }
              >
                <ApperIcon name={route.icon} className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{route.label.split(' ')[0]}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Layout;