import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  isMobileMenuOpen: boolean;
  isCartDrawerOpen: boolean;
  isSearchOpen: boolean;
  theme: Theme;
  toggleMobileMenu: () => void;
  setMobileMenu: (open: boolean) => void;
  toggleCartDrawer: () => void;
  setCartDrawer: (open: boolean) => void;
  toggleSearch: () => void;
  setSearch: (open: boolean) => void;
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isCartDrawerOpen: false,
  isSearchOpen: false,
  theme: 'light',

  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  setMobileMenu: (open) => set({ isMobileMenuOpen: open }),

  toggleCartDrawer: () => set((s) => ({ isCartDrawerOpen: !s.isCartDrawerOpen })),
  setCartDrawer: (open) => set({ isCartDrawerOpen: open }),

  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
  setSearch: (open) => set({ isSearchOpen: open }),

  setTheme: (theme) => {
    localStorage.setItem('pharma_theme', theme);
    applyTheme(theme);
    set({ theme });
  },

  initTheme: () => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('pharma_theme') as Theme | null;
    const theme = saved || 'light';
    applyTheme(theme);
    set({ theme });
  },
}));
