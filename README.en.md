# Construction Decision Analysis Platform

## Overview

This project is a decision analysis platform for construction companies, built around a Single Source of Truth (SSOT) architecture. The first module implemented is the **"Bidding Optimization Decision System"**.

The system uses Mixed Integer Linear Programming (MILP) models with the PuLP solver to perform optimization calculations, helping construction companies quickly evaluate optimal duration and cost allocation plans during the bidding phase.

---

## Features

### 1. Project Management
- Complete CRUD operations for projects
- Project status tracking (Draft, Active, Completed)
- Activity relationship management

### 2. Activity Management
- Define activities with normal and crash durations/costs
- Set precedence relationships
- CSV batch import functionality
- Data validation (crash duration ≤ normal duration, crash cost ≥ normal cost)

### 3. Bidding Optimization
Two decision modes:
- **Mode 1**: Given budget → Minimize duration
- **Mode 2**: Given duration → Minimize cost

Features:
- Penalty and bonus calculations
- Indirect cost consideration
- MILP optimization
- Visualization of results

### 4. Result Analysis
- Result summary (optimal duration, cost, penalty, bonus)
- Gantt chart (activity schedule visualization)
- Cost analysis chart
- Activity schedule details table
- Export to PDF/Excel

### 5. MILP Process Explanation
- Problem type explanation
- Mathematical model details
- Solver method and steps
- Conclusion and recommendations

### 6. Multilingual Support (New!)
- Traditional Chinese (繁體中文)
- English
- Language switcher in navigation bar
- Persistent language preference
- Element Plus UI components language integration

---

## Technology Stack

### Frontend
- **Framework**: Vue 3 + Vite
- **UI Library**: Element Plus
- **Charts**: ECharts
- **HTTP Client**: Axios
- **I18n**: Vue I18n
- **Report Generation**: jsPDF, xlsx

### Backend
- **Framework**: FastAPI (Python)
- **Optimization Solver**: PuLP
- **Data Validation**: Pydantic
- **Database Client**: Supabase Python Client

### Database
- **Database**: Supabase (PostgreSQL)
- Core tables: projects, project_activities, activity_precedences, bidding_scenarios, optimization_results, activity_schedules

---

## Installation

### Prerequisites
- Node.js 16+ 
- Python 3.9+
- Supabase account

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python main.py
```

### Environment Configuration

Create a `.env` file:

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Backend
API_URL=http://localhost:8000
```

---

## Using the Multilingual Feature

### Switching Languages

1. Click the language selector (globe icon) in the top-right corner of the navigation bar
2. Select your preferred language (繁體中文 or English)
3. The system will automatically refresh to apply the new language setting

### Language Persistence

Your language preference is saved to localStorage and will persist across sessions.

---

## Project Structure

```
ManagementScience_TermProject/
├── backend/                 # Backend (FastAPI)
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── models/         # Optimization models
│   │   ├── schemas/        # Data schemas
│   │   └── utils/          # Utilities
│   ├── main.py             # Entry point
│   └── requirements.txt
├── src/                     # Frontend (Vue 3)
│   ├── components/         # Vue components
│   ├── views/              # Page views
│   ├── router/             # Vue Router
│   ├── services/           # API services
│   ├── utils/              # Utilities
│   ├── i18n/               # Internationalization
│   │   ├── index.js        # i18n configuration
│   │   └── locales/        # Language packs
│   │       ├── zh-TW.js    # Traditional Chinese
│   │       └── en-US.js    # English
│   ├── App.vue             # Root component
│   └── main.js             # Entry point
├── docs/                    # Documentation
│   ├── PRD.md              # Product Requirements
│   ├── UserManual.md       # User Manual
│   ├── FeatureCodeMap.md   # Feature-Code Mapping
│   ├── I18N_GUIDE.md       # I18n Guide
│   └── 專案成果報告書.md    # Project Report (Chinese)
├── supabase/               # Database migrations
└── public/                 # Static assets
```

---

## Core Functionalities

### 1. Project and Activity Management
- Create projects and define activities
- Set precedence relationships
- Import activities via CSV

### 2. Optimization Calculation
- Select calculation mode (budget constraint or duration constraint)
- Input parameters (indirect cost, penalty/bonus settings)
- Execute MILP optimization
- Get optimal solution

### 3. Result Visualization
- View result summary
- Gantt chart for schedule
- Cost analysis chart
- Export reports (PDF/Excel)

### 4. Mathematical Model

#### Decision Variables
- x_i: Start time of activity i (integer)
- y_i: Whether activity i is crashed (binary, 0 or 1)
- T: Total project duration (integer)

#### Objective Function

**Mode 1 (Given Budget, Minimize Duration):**
```
minimize Z = T + Penalty - Bonus
subject to: DirectCost + IndirectCost ≤ Budget
```

**Mode 2 (Given Duration, Minimize Cost):**
```
minimize Z = DirectCost + IndirectCost + Penalty - Bonus
subject to: T = Duration
```

#### Constraints
1. Precedence constraints
2. Duration definition constraints
3. Budget or duration constraints
4. Variable restrictions

---

## Usage Examples

### Example 1: Budget Constraint Mode

**Scenario:**
- Project has 10 activities
- Budget: NT$ 5,000,000
- Target duration: 60 days
- Daily indirect cost: NT$ 10,000

**Steps:**
1. Create project and import activities
2. Select "Fixed Budget" mode
3. Input budget constraint: 5,000,000
4. Set target duration: 60 days
5. Input penalty/bonus settings
6. Click "Start Calculation"
7. View results and export report

**Result:**
- Optimal duration: 55 days
- Direct cost: NT$ 4,450,000
- Indirect cost: NT$ 550,000
- Bonus: NT$ 50,000
- Total cost: NT$ 4,950,000

### Example 2: Duration Constraint Mode

**Scenario:**
- Project has 15 activities
- Required completion: 45 days
- Contract amount: NT$ 10,000,000
- Daily penalty: NT$ 50,000

**Steps:**
1. Create project and define activities
2. Select "Fixed Duration" mode
3. Input duration constraint: 45 days
4. Set contract amount and penalty rate
5. Click "Start Calculation"
6. Review crashed activities
7. Export schedule

**Result:**
- Optimal duration: 45 days (as required)
- Direct cost: NT$ 6,200,000
- Crashed activities: 5 out of 15
- Total cost: NT$ 6,650,000

---

## Documentation

Detailed documentation is available in the `docs/` directory:

- **PRD.md**: Product Requirements Document
- **UserManual.md**: User Manual
- **FeatureCodeMap.md**: Feature-Code Mapping
- **I18N_GUIDE.md**: Internationalization Guide
- **專案成果報告書.md**: Project Report (Chinese)

---

## API Endpoints

### Project Management
- `GET /projects` - Get project list
- `POST /projects` - Create project
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

### Activity Management
- `GET /activities` - Get activity list
- `POST /activities` - Create activity
- `PUT /activities/{id}` - Update activity
- `DELETE /activities/{id}` - Delete activity

### Optimization
- `POST /optimization/optimize` - Execute optimization
- `GET /optimization/results/{id}` - Get optimization results

---

## Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests if applicable
5. Update documentation
6. Submit a pull request

### Adding a New Language

1. Create a new language file in `src/i18n/locales/` (e.g., `ja-JP.js`)
2. Translate all keys from the existing language files
3. Register the new language in `src/i18n/index.js`
4. Add the language option to the language switcher in `App.vue`
5. Test thoroughly
6. Submit a pull request

---

## Testing

### Frontend
```bash
# Run development server
npm run dev

# Build and preview
npm run build
npm run preview
```

### Backend
```bash
# Start backend server
cd backend
python main.py
```

### Testing Checklist
- [ ] Create and manage projects
- [ ] Define activities and relationships
- [ ] Import activities via CSV
- [ ] Run optimization in both modes
- [ ] View and analyze results
- [ ] Export PDF and Excel reports
- [ ] Switch between languages
- [ ] All UI elements display correct translations

---

## Known Issues & Limitations

1. **Resource Constraints**: Does not consider resource limitations (labor, equipment)
2. **Uncertainty**: Does not account for uncertainty factors (weather, supply chain risks)
3. **Deterministic Values**: Activity durations and costs are assumed to be deterministic
4. **Single Project**: Only supports single project optimization (not multi-project scheduling)

---

## Future Enhancements

1. **Resource Management**: Add resource allocation and constraints
2. **Risk Analysis**: Incorporate uncertainty and risk assessment
3. **Multi-Project Scheduling**: Support multiple projects with shared resources
4. **Progress Tracking**: Real-time progress monitoring and variance analysis
5. **Quality Management**: Integrate quality checkpoints and costs
6. **Cash Flow Analysis**: Project cash flow forecasting and financing requirements
7. **Mobile App**: Native mobile application
8. **AI-Assisted Decisions**: Machine learning for cost/duration prediction
9. **More Languages**: Add support for more languages (Japanese, Korean, etc.)

---

## License

This project is developed for educational purposes as part of a Management Science term project.

---

## Contact

For questions or suggestions:
- Create an Issue
- Submit a Pull Request
- Contact project maintainers

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Status:** Production Ready

---

## Acknowledgments

- **PuLP**: Open-source MILP solver
- **Vue.js**: Progressive JavaScript framework
- **Element Plus**: Vue 3 UI component library
- **FastAPI**: Modern Python web framework
- **Supabase**: Open-source Firebase alternative
- **Vue I18n**: Internationalization plugin for Vue.js

