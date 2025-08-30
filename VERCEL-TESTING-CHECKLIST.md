# 🧪 Vercel Preview Testing Checklist

## 📋 Pre-Deployment Checks

### ✅ Local Development
- [ ] `pnpm install` completed successfully
- [ ] `pnpm run check-tailwind` passes all checks
- [ ] `pnpm run dev` starts without errors
- [ ] No console errors in development

### 🔧 Build Process
- [ ] `pnpm run build` completes successfully
- [ ] Build output shows no Tailwind-related warnings
- [ ] Bundle size is reasonable (check for significant changes)
- [ ] Build time is acceptable

## 🚀 Vercel Preview Testing

### 🏠 Homepage & Core Pages
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Main layout renders properly
- [ ] No visual regressions compared to main branch

### 🎨 UI Components Testing

#### 🖱️ Interactive Elements
- [ ] Buttons hover states work
- [ ] Form inputs focus states correct
- [ ] Dropdowns open/close properly
- [ ] Modals display correctly
- [ ] Tooltips show as expected

#### 📱 Responsive Design
- [ ] Mobile view (320px-768px) looks correct
- [ ] Tablet view (768px-1024px) renders properly  
- [ ] Desktop view (1024px+) displays correctly
- [ ] No horizontal scroll on any screen size
- [ ] Touch targets appropriate for mobile

#### 🌓 Dark Mode
- [ ] Dark mode toggle works
- [ ] All colors switch properly
- [ ] No light mode colors bleeding through
- [ ] Text remains readable in both modes
- [ ] Images/icons adapt correctly

### 🧩 Component Library Testing

#### Radix UI Components
- [ ] Accordion expand/collapse
- [ ] Alert dialogs show correctly
- [ ] Avatar components display
- [ ] Checkbox interactions work
- [ ] Dialog modals function
- [ ] Dropdown menus work
- [ ] Navigation menu functions
- [ ] Popover positioning correct
- [ ] Progress bars display
- [ ] Select components work
- [ ] Switch toggles function
- [ ] Tabs switch correctly
- [ ] Toast notifications appear
- [ ] Tooltip positioning correct

#### Custom Components
- [ ] Search functionality works
- [ ] Data tables render correctly
- [ ] Charts display properly (if using Recharts)
- [ ] Loading states show correctly
- [ ] Error states display properly

### 🔍 Google Maps Integration
- [ ] Maps load correctly
- [ ] Scraping functionality works
- [ ] Location search functions
- [ ] Map interactions (zoom, pan) work
- [ ] Markers display properly
- [ ] Info windows show correctly

### ⚡ Performance Testing
- [ ] Page load time acceptable
- [ ] CSS bundle size reasonable
- [ ] No layout shift (CLS)
- [ ] Images load properly
- [ ] Animations smooth

### 🐛 Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## 🔧 Developer Tools Verification

### 📊 Chrome DevTools
- [ ] No console errors
- [ ] No console warnings related to Tailwind
- [ ] CSS custom properties showing correctly
- [ ] Network tab shows reasonable CSS bundle size
- [ ] Lighthouse score maintained

### 🎨 CSS Inspection
- [ ] CSS custom properties (--color-*) visible in DevTools
- [ ] Tailwind classes applying correctly
- [ ] No conflicting CSS rules
- [ ] Animations working smoothly
- [ ] Responsive breakpoints correct

### 📱 Responsive Design Mode
- [ ] All common device sizes work
- [ ] Breakpoint transitions smooth
- [ ] No content cutoff
- [ ] Touch interactions work

## 🔄 Comparison with Main Branch

### 📸 Visual Regression
- [ ] Take screenshots of key pages
- [ ] Compare with main branch screenshots
- [ ] Document any visual differences
- [ ] Verify differences are expected

### 🔧 Functionality Parity
- [ ] All features work as in main branch
- [ ] No functionality broken
- [ ] Performance similar or better
- [ ] User experience maintained

## 📝 Testing Notes

### ✅ Passed Tests
```
- Test name: [RESULT]
- Notes: [Any observations]
```

### ❌ Failed Tests
```
- Test name: [ISSUE DESCRIPTION]
- Impact: [High/Medium/Low]
- Fix required: [Yes/No]
```

### ⚠️ Concerns/Observations
```
- Item: [DESCRIPTION]
- Action needed: [DESCRIPTION]
```

## 🚦 Final Approval

### ✅ Ready to Merge Criteria
- [ ] All critical tests pass
- [ ] No major visual regressions
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Dark mode works correctly
- [ ] Mobile responsive
- [ ] Core functionality intact

### 📋 Sign-off
- **Tested by**: _______________
- **Date**: _______________
- **Approved for merge**: [ ] Yes [ ] No
- **Additional notes**: _______________

---

**🎯 Only merge after ALL checkboxes are completed and approved!**
