# Components Structure

## 📁 Directory Organization

```
src/components/
├── ui/                    # Pure UI components (reusable)
│   ├── button.jsx
│   ├── input.jsx
│   ├── card.jsx
│   ├── DateInput.jsx
│   ├── LoadingSpinner.jsx
│   └── ...
├── forms/                 # Form components
│   ├── QuoteForm.jsx
│   ├── CreateScheduleModal.jsx
│   └── index.js
├── features/              # Feature-specific components
│   ├── work-schedule/     # Work schedule feature
│   ├── workers/           # Workers management
│   ├── customer/          # Customer management
│   └── quotes/            # Quotes management
├── common/                # Common business components
│   ├── WardSearch.jsx
│   ├── WardStats.jsx
│   ├── Map.jsx
│   └── map/
├── layout/                # Layout components
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── AdminLayout.jsx
│   └── ...
└── index.js              # Main export file
```

## 🎯 Component Categories

### **UI Components** (`/ui`)
- **Pure reusable components** with no business logic
- **Generic** and can be used anywhere
- **Examples**: Button, Input, Card, LoadingSpinner, DateInput

### **Form Components** (`/forms`)
- **Form-related components** with validation
- **Modal forms** and input forms
- **Examples**: QuoteForm, CreateScheduleModal

### **Feature Components** (`/features`)
- **Feature-specific components** grouped by domain
- **Business logic** and feature-specific functionality
- **Examples**: WorkSchedule, Workers, Customer, Quotes

### **Common Components** (`/common`)
- **Shared business components** used across features
- **Domain-specific** but not feature-specific
- **Examples**: WardSearch, WardStats, Map

### **Layout Components** (`/layout`)
- **Layout and navigation** components
- **Page structure** and routing
- **Examples**: Header, Sidebar, AdminLayout

## 📦 Usage

```jsx
// Import from main index
import { Button, DateInput, CreateScheduleModal } from '@/components';

// Import from specific category
import { Button } from '@/components/ui';
import { CreateScheduleModal } from '@/components/forms';
import { WorkTable } from '@/components/features/work-schedule';
```

## 🔧 Guidelines

1. **UI Components**: Keep pure, no business logic
2. **Form Components**: Handle validation and submission
3. **Feature Components**: Group by domain/feature
4. **Common Components**: Share across features
5. **Layout Components**: Handle page structure

## 📝 Naming Conventions

- **PascalCase** for component files
- **camelCase** for utility functions
- **kebab-case** for CSS classes
- **Descriptive names** that indicate purpose
