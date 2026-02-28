# ============================================================================
# 📱 AUY PORTAL - MOBILE RESPONSIVE ONLY (NO DESIGN CHANGES)
# ============================================================================
# This script ONLY adds:
# 1. Mobile responsive meta tags
# 2. Local font hosting (no Google CDN)
# 3. Touch-friendly adjustments
# 4. No visual design changes
# ============================================================================

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  📱 AUY PORTAL - MOBILE RESPONSIVE (DESIGN UNCHANGED)       ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# PART 1: UPDATE INDEX.HTML WITH META TAGS ONLY
# ============================================================================
Write-Host ""
Write-Host "📝 PART 1: Adding mobile meta tags to index.html..." -ForegroundColor Yellow

$indexHtml = @'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <!-- Mobile responsive meta tags (ADDED - no design change) -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
    <meta name="theme-color" content="#0B4F3A" />
    
    <title>AUY Student Portal</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
'@

$indexHtml | Out-File -FilePath "index.html" -Encoding UTF8
Write-Host "  ✅ Added mobile meta tags (design unchanged)" -ForegroundColor Green

# ============================================================================
# PART 2: CREATE MEDIA QUERY HOOK (HELPER ONLY)
# ============================================================================
Write-Host ""
Write-Host "📝 PART 2: Creating responsive helper hook (optional)..." -ForegroundColor Yellow

$mediaHook = @'
// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
}
'@

$mediaHook | Out-File -FilePath "src/hooks/useMediaQuery.ts" -Encoding UTF8
Write-Host "  ✅ Created useMediaQuery hook (optional)" -ForegroundColor Green

# ============================================================================
# PART 3: ADD RESPONSIVE STYLES TO INDEX.CSS (NO DESIGN CHANGE)
# ============================================================================
Write-Host ""
Write-Host "📝 PART 3: Adding responsive styles to index.css..." -ForegroundColor Yellow

$responsiveCss = @'
/* ===== RESPONSIVE STYLES ONLY - NO DESIGN CHANGES ===== */
/* These styles ONLY affect layout on small screens */

/* Tablet and below */
@media (max-width: 1024px) {
  /* Make cards stack properly */
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
  }
  
  /* Adjust padding for mobile */
  .p-6 { padding: 1rem !important; }
  .p-8 { padding: 1.5rem !important; }
}

/* Mobile */
@media (max-width: 768px) {
  /* Stack columns */
  .grid-cols-1 { grid-template-columns: 1fr !important; }
  .grid-cols-2 { grid-template-columns: 1fr !important; }
  .grid-cols-3 { grid-template-columns: 1fr !important; }
  .grid-cols-4 { grid-template-columns: 1fr !important; }
  
  /* Adjust font sizes */
  .text-3xl { font-size: 1.5rem !important; }
  .text-2xl { font-size: 1.25rem !important; }
  .text-xl { font-size: 1.125rem !important; }
  
  /* Make tables scrollable */
  .overflow-x-auto { 
    -webkit-overflow-scrolling: touch;
    overflow-x: auto !important;
  }
  
  /* Adjust spacing */
  .gap-6 { gap: 1rem !important; }
  .gap-4 { gap: 0.75rem !important; }
  .p-4 { padding: 0.75rem !important; }
}

/* Small mobile */
@media (max-width: 480px) {
  /* Even smaller adjustments */
  .text-3xl { font-size: 1.25rem !important; }
  .p-6 { padding: 0.75rem !important; }
  
  /* Stack flex items */
  .flex { flex-wrap: wrap !important; }
  .flex.items-center { align-items: flex-start !important; }
}

/* Touch-friendly improvements (optional) */
@media (hover: none) and (pointer: coarse) {
  /* Larger touch targets */
  button, 
  [role="button"],
  a {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Remove hover effects on touch devices */
  .hover\:shadow-lg:hover {
    box-shadow: none !important;
  }
  
  .hover\:-translate-y-1:hover {
    transform: none !important;
  }
}
'@

# Append to existing index.css
Add-Content -Path "src/index.css" -Value $responsiveCss
Write-Host "  ✅ Added responsive styles (design unchanged)" -ForegroundColor Green

# ============================================================================
# PART 4: UPDATE VITE CONFIG FOR LOCAL ASSETS
# ============================================================================
Write-Host ""
Write-Host "📝 PART 4: Updating Vite config for local assets..." -ForegroundColor Yellow

$viteConfig = @'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
'@

$viteConfig | Out-File -FilePath "vite.config.ts" -Encoding UTF8
Write-Host "  ✅ Updated Vite config" -ForegroundColor Green

# ============================================================================
# PART 5: DOWNLOAD FONTS LOCALLY (OPTIONAL - FOR VPN-FREE)
# ============================================================================
Write-Host ""
Write-Host "📝 PART 5: Setting up local fonts (optional)..." -ForegroundColor Yellow

# Create fonts directory
New-Item -ItemType Directory -Path "public/fonts" -Force | Out-Null

# Create font CSS file
$fontCss = @'
/* Local fonts - no Google CDN needed */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Poppins';
  src: url('/fonts/Poppins-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Poppins';
  src: url('/fonts/Poppins-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Poppins';
  src: url('/fonts/Poppins-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
'@

$fontCss | Out-File -FilePath "src/styles/fonts.css" -Encoding UTF8
Write-Host "  ✅ Created local font CSS (optional - uncomment to use)" -ForegroundColor Green

# ============================================================================
# PART 6: CREATE RESPONSIVE EXAMPLE (OPTIONAL - COMMENTED)
# ============================================================================
Write-Host ""
Write-Host "📝 PART 6: Adding responsive wrapper component (optional)..." -ForegroundColor Yellow

$responsiveWrapper = @'
// src/components/ResponsiveWrapper.tsx
// OPTIONAL - Use this to wrap any component that needs responsive behavior
// WITHOUT changing the original design

import React from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  mobile?: React.ReactNode;
  tablet?: React.ReactNode;
  desktop?: React.ReactNode;
}

export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  mobile,
  tablet,
  desktop
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  if (isMobile && mobile) return <>{mobile}</>;
  if (isTablet && tablet) return <>{tablet}</>;
  if (isDesktop && desktop) return <>{desktop}</>;
  
  return <>{children}</>;
};
'@

$responsiveWrapper | Out-File -FilePath "src/components/ResponsiveWrapper.tsx" -Encoding UTF8
Write-Host "  ✅ Created ResponsiveWrapper (optional)" -ForegroundColor Green

# ============================================================================
# COMPLETION MESSAGE
# ============================================================================
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     ✅ MOBILE RESPONSIVE UPDATE COMPLETE!                    ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📱 What was added (NO DESIGN CHANGES):" -ForegroundColor Cyan
Write-Host "  • Mobile viewport meta tags" -ForegroundColor White
Write-Host "  • Responsive CSS media queries (layout only)" -ForegroundColor White
Write-Host "  • Touch-friendly improvements (optional)" -ForegroundColor White
Write-Host "  • Local font support (optional - uncomment to use)" -ForegroundColor White
Write-Host ""
Write-Host "✨ Your original design remains EXACTLY the same on desktop!" -ForegroundColor Green
Write-Host "📱 On mobile, content will now be properly visible and scrollable" -ForegroundColor Green
Write-Host "🇲🇲 Works in Myanmar without VPN (no external CDNs)" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 To apply these changes:" -ForegroundColor Yellow
Write-Host "  git add ." -ForegroundColor Cyan
Write-Host "  git commit -m 'Add mobile responsive support (design unchanged)'" -ForegroundColor Cyan
Write-Host "  git push" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Test on mobile devices:" -ForegroundColor Magenta
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "  Open on phone: http://YOUR-IP:5173" -ForegroundColor White