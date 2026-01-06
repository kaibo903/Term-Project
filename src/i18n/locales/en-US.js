// English Language Pack
export default {
  // Common
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    reset: 'Reset',
    submit: 'Submit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    loading: 'Loading...',
    noData: 'No Data',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    yes: 'Yes',
    no: 'No',
    all: 'All',
    none: 'None',
    days: 'Days',
    currency: 'NT$',
    daysUnit: ' (Days)',
    currencyUnit: ' (NT$)',
    noChartData: 'No data to display',
    languageChangeSuccess: 'Language changed successfully'
  },

  // Navigation
  nav: {
    home: 'Home',
    projectManagement: 'Project Management',
    optimization: 'Schedule Cost Optimization',
    results: 'Result Analysis',
    admin: 'Administrator'
  },

  // Project Management
  project: {
    title: 'Project Management',
    create: 'Create Project',
    edit: 'Edit Project',
    delete: 'Delete Project',
    name: 'Project Name',
    description: 'Description',
    status: 'Status',
    createdAt: 'Created At',
    actions: 'Actions',
    manageActivities: 'Manage Activities',
    emptyText: 'No projects yet. Click "Create Project" to get started',
    namePlaceholder: 'Enter project name',
    descriptionPlaceholder: 'Enter project description',
    deleteConfirm: 'Are you sure you want to delete project "{name}"? This will delete all related activities and scenarios.',
    deleteTitle: 'Confirm Deletion',
    createSuccess: 'Project created successfully',
    updateSuccess: 'Project updated successfully',
    deleteSuccess: 'Project deleted',
    loadError: 'Failed to load project list: {error}',
    saveError: 'Save failed: {error}',
    deleteError: 'Delete failed: {error}',
    nameRequired: 'Please enter project name',
    status: {
      draft: 'Draft',
      active: 'Active',
      completed: 'Completed'
    }
  },

  // Activities
  activity: {
    title: 'Activity Management',
    create: 'Add Activity',
    edit: 'Edit Activity',
    delete: 'Delete Activity',
    name: 'Activity Name',
    description: 'Description',
    normalDuration: 'Normal Duration',
    crashDuration: 'Crash Duration',
    normalCost: 'Normal Cost',
    crashCost: 'Crash Cost',
    predecessors: 'Predecessors',
    successors: 'Successors',
    actions: 'Actions',
    csvImport: 'Import CSV',
    emptyText: 'No activities',
    namePlaceholder: 'Enter activity name',
    selectPredecessors: 'Select',
    noPredecessors: 'None',
    multiple: '(Multiple)',
    systemDisplay: '(System Display)',
    unnamed: 'Unnamed Activity',
    // Dialog
    dialogTitle: {
      create: 'Add Activity',
      edit: 'Edit Activity'
    },
    formSection: {
      basic: 'Basic Information',
      normal: 'Normal Activity',
      crash: 'Crash Activity',
      relationship: 'Activity Relationship'
    },
    placeholder: {
      description: 'Enter activity description (optional)',
      normalDuration: 'Enter normal duration',
      normalCost: 'Enter normal cost',
      crashDuration: 'Enter crash duration',
      crashCost: 'Enter crash cost',
      predecessors: 'Select predecessors (optional)'
    },
    deleteConfirm: 'Are you sure you want to delete activity "{name}"?',
    deleteTitle: 'Confirm Deletion',
    createSuccess: 'Activity added successfully',
    updateSuccess: 'Activity updated successfully',
    deleteSuccess: 'Activity deleted',
    loadError: 'Failed to load activities: {error}',
    saveError: 'Save failed: {error}',
    deleteError: 'Delete failed: {error}',
    validationError: {
      nameRequired: 'Please enter activity name',
      durationRequired: 'Please enter duration',
      costRequired: 'Please enter cost',
      crashDurationInvalid: 'Crash duration must be ≤ normal duration',
      crashCostInvalid: 'Crash cost must be ≥ normal cost'
    },
    csvImportDialog: {
      title: 'Import Activities from CSV',
      selectFile: 'Select File',
      downloadTemplate: 'Download CSV Template',
      instructionsTitle: 'Import Instructions',
      instruction1: 'CSV file must contain the following columns: Activity Name, Normal Duration, Normal Cost, Crash Duration, Crash Cost',
      instruction2: 'Optional columns: Description, Predecessors (separate multiple predecessors with commas)',
      instruction3: 'First row should be the header row, system will automatically recognize column names',
      instruction4: 'Supports UTF-8 and Big5 encoding',
      dragText: 'Drag CSV file here, or ',
      clickText: 'click to upload',
      fileFormatTip: 'Only CSV file format is supported',
      previewTitle: 'Data Preview (first 5 records)',
      totalRecords: 'Total {count} records',
      errorTitle: 'Error Messages',
      startImport: 'Start Import',
      uploadInstruction: 'Please upload a CSV file containing activity data',
      fileFormat: 'File Format Requirements',
      formatDesc: 'CSV file must contain the following columns:',
      fields: {
        name: 'Activity Name (Required)',
        normalDuration: 'Normal Duration (Required, Integer)',
        crashDuration: 'Crash Duration (Required, Integer, ≤ Normal Duration)',
        normalCost: 'Normal Cost (Required, Number)',
        crashCost: 'Crash Cost (Required, Number, ≥ Normal Cost)',
        predecessors: 'Predecessors (Optional, semicolon-separated activity names)'
      },
      example: 'Example',
      importSuccess: 'Successfully imported {count} activities',
      importSuccessWithFail: 'Successfully imported {successCount} activities, {failCount} failed',
      importAllFailed: 'All activities failed to import',
      importError: 'Import process error: {error}',
      importItemError: 'Failed to import "{name}": {error}',
      parseError: 'CSV parsing failed: {error}',
      parseSuccess: 'Successfully parsed {count} activities',
      noValidData: 'No valid activity data found',
      noFile: 'No data to import'
    }
  },

  // Bidding Optimization
  optimization: {
    title: 'Schedule Cost Optimization',
    subtitle: 'Enter project parameters, and the system will calculate the optimal schedule and cost',
    settings: 'Parameter Settings',
    results: 'Calculation Results',
    calculate: 'Start Calculation',
    calculating: 'Calculating...',
    basicInfo: 'Basic Information',
    penaltySettings: 'Penalty & Bonus Settings',
    
    // Basic Settings
    selectProject: 'Select Project',
    selectProjectPlaceholder: 'Please select a project',
    mode: 'Calculation Mode',
    budgetFixed: 'Fixed Budget',
    durationFixed: 'Fixed Duration',
    budgetConstraint: 'Budget Limit',
    durationConstraint: 'Required Completion Days',
    budgetPlaceholder: 'Enter budget limit',
    durationPlaceholder: 'Enter required completion days',
    indirectCost: 'Daily Indirect Cost',
    indirectCostPlaceholder: 'Enter daily indirect cost',
    
    // Penalty Settings
    penaltyType: 'Penalty Calculation Method',
    penaltyTypeFixed: 'Fixed Amount',
    penaltyTypeRate: 'Rate',
    penaltyAmount: 'Daily Penalty Amount',
    penaltyRate: 'Penalty Rate',
    penaltyAmountPlaceholder: 'Enter daily penalty amount',
    penaltyRatePlaceholder: 'Enter penalty rate',
    contractAmount: 'Contract Amount',
    contractAmountPlaceholder: 'Enter contract amount',
    contractDuration: 'Contract Duration',
    contractDurationPlaceholder: 'Enter contract duration',
    targetDuration: 'Target Completion Days',
    targetDurationPlaceholder: 'Enter target completion days (optional)',
    
    // Calculation Instructions
    penaltyCalculation: {
      title: 'Late Penalty Calculation Method',
      fixed: 'Fixed Amount: Daily fixed amount × Overdue days',
      rate: 'Rate: Contract amount × Penalty rate × Overdue days',
      limit: 'Penalty Limit: 20% of contract amount'
    },
    bonusCalculation: {
      title: 'Early Completion Bonus Calculation Method',
      formula: 'Formula:',
      formulaText: 'Bonus = Contract Amount × Early Days ÷ Contract Duration × 5%',
      example: 'Example: Contract amount $10M, contract duration 100 days, completed 10 days early',
      exampleCalc: 'Bonus = 10,000,000 × 10 ÷ 100 × 5% = 50,000',
      limit: 'Bonus Limit: 1% of contract amount'
    },
    
    // Calculation Results
    noResults: 'No calculation yet',
    noResultsDesc: 'Complete the settings on the left and click "Start Calculation"',
    optimalDuration: 'Optimal Duration',
    directCost: 'Direct Cost',
    indirectCostTotal: 'Indirect Cost',
    totalCost: 'Total Cost',
    totalCostNote: '(Including Penalty & Bonus)',
    penaltyAmount: 'Late Penalty',
    bonusAmount: 'Early Completion Bonus',
    penaltyLimit: 'Limit: {amount} (20% of contract amount)',
    bonusLimit: 'Limit: {amount} (1% of contract amount)',
    
    // Result Summary
    resultSummary: 'Optimization Result Summary',
    summaryText: 'Calculation completed! The system has used Mixed Integer Linear Programming (MILP) to find the optimal solution.',
    costBreakdown: 'Cost Breakdown',
    costFormula: {
      direct: 'Direct Cost: {amount}',
      indirect: '+ Indirect Cost: {amount}',
      penalty: '+ Penalty: {amount}',
      bonus: '- Bonus: {amount}',
      total: '= Total Cost (with Penalty & Bonus): {amount}'
    },
    crashedActivities: 'The system automatically selected {crashed} activities out of {total} total activities for crashing (shortening duration, increasing cost), and rescheduled the start and end times of each activity to achieve the optimal objective value.',
    detailTip: 'Want to understand the detailed mathematical model and calculation process? Click the "View Detailed Results and Charts" button below. The result analysis page contains complete MILP mathematical derivation and step-by-step calculation instructions.',
    
    // Activity Schedule
    scheduleDetail: 'Detailed Activity Schedule',
    crashedInfo: 'Crashed Activities ({count} items)',
    activityName: 'Activity Name',
    startTime: 'Start',
    endTime: 'End',
    duration: 'Duration',
    cost: 'Cost',
    status: 'Status',
    crashed: 'Crashed',
    normal: 'Normal',
    
    // Actions
    viewDetails: 'View Detailed Results and Charts',
    
    // Validation
    validation: {
      projectRequired: 'Please select a project',
      modeRequired: 'Please select calculation mode',
      budgetRequired: 'Please enter budget constraint',
      durationRequired: 'Please enter duration constraint'
    },
    
    // Messages
    success: 'Optimization calculation completed',
    error: 'Optimization calculation failed: {error}',
    resetSuccess: 'Form reset',
    loadProjectsError: 'Failed to load project list: {error}'
  },

  // Result Analysis
  results: {
    title: 'Optimization Result Analysis',
    exportPDF: 'Export PDF',
    exportExcel: 'Export Excel',
    exportingPDF: 'Exporting...',
    exportingExcel: 'Exporting...',
    
    // Summary
    summary: {
      optimalDuration: 'Optimal Duration',
      optimalCost: 'Optimal Cost',
      penaltyAmount: 'Penalty',
      bonusAmount: 'Bonus',
      totalCost: 'Total Cost (with Penalty & Bonus)'
    },
    
    // Charts
    ganttChart: 'Activity Schedule Gantt Chart',
    costAnalysis: 'Cost Analysis',
    scheduleDetail: 'Activity Schedule Details',
    
    // Table Fields
    activityName: 'Activity Name',
    startTime: 'Start Time (Days)',
    endTime: 'End Time (Days)',
    duration: 'Duration (Days)',
    crashed: 'Crashed',
    cost: 'Cost',
    yes: 'Yes',
    no: 'No',
    
    // Messages
    noResults: 'No optimization results found',
    loadError: 'Failed to load optimization results: {error}',
    exportPDFSuccess: 'PDF exported successfully',
    exportPDFError: 'PDF export failed: {error}',
    exportExcelSuccess: 'Excel exported successfully',
    exportExcelError: 'Excel export failed: {error}',
    noDataToExport: 'No data to export',
    missingResultId: 'Please provide result ID'
  },

  // Optimization Process
  process: {
    title: 'Optimization Calculation Process',
    
    // Problem Type
    problemType: 'I. Problem Type',
    milp: 'Mixed Integer Linear Programming (MILP)',
    milpDesc: 'This system uses MILP to solve construction project optimization problems. MILP is a mathematical optimization method where some variables are restricted to integers (e.g., start times, durations), and some variables are 0/1 binary variables (e.g., whether to crash).',
    
    // Optimization Mode
    optimizationMode: 'II. Optimization Mode',
    mode1: 'Mode 1: Given Budget, Minimize Duration',
    mode2: 'Mode 2: Given Duration, Minimize Cost',
    constraints: {
      budget: 'Budget Constraint: ',
      duration: 'Duration Constraint: ',
      indirect: 'Indirect Cost: ',
      target: 'Target Duration: ',
      perDay: ' / day'
    },
    
    // Mathematical Model
    mathModel: 'III. MILP Mathematical Model',
    
    // Decision Variables
    decisionVariables: '3.1 Decision Variables',
    variables: {
      startTime: ': Start time of activity i (integer variable, unit: days)',
      crashed: ': Whether activity i is crashed (binary variable, 0 = normal, 1 = crashed)',
      totalDuration: ': Project total duration (integer variable, unit: days)'
    },
    variableCount: 'Total Variables:',
    variableDetails: {
      continuous: 'Continuous/Integer Variables: {count} ({activities} activity start times + 1 total duration)',
      binary: 'Binary Variables: {count} (crash decision for each activity)'
    },
    
    // Objective Function
    objective: '3.2 Objective Function',
    objectiveGoal: 'Objective:',
    objectiveWhere: 'Where:',
    objectiveItems: {
      duration: 'Project Total Duration',
      directCost: 'Direct Cost',
      indirectCost: 'Indirect Cost',
      penalty: 'Penalty (if T > target duration)',
      bonus: 'Bonus (if T < target duration)'
    },
    totalObjective: 'Total Objective Value:',
    totalCostWithPenalty: 'Total Cost (with Penalty & Bonus):',
    
    // Constraints
    constraints_section: '3.3 Constraints',
    constraintTypes: {
      precedence: {
        title: 'Precedence Constraints ({count} constraints)',
        formula: 'x_j ≥ x_i + d_i, ∀ (i, j) ∈ precedence relations',
        desc: 'Where d_i = d_i,normal × (1 - y_i) + d_i,crash × y_i',
        explain: 'Explanation: Successor activity j must start after predecessor activity i is completed',
        example: 'Example:',
        exampleText: '{successor} must start after {predecessor} is completed',
        more: '...total {count} precedence relations'
      },
      durationDef: {
        title: 'Duration Definition Constraints ({count} constraints)',
        formula: 'T ≥ x_i + d_i, ∀ i ∈ activity set',
        explain: 'Explanation: Project total duration must be ≥ completion time of all activities'
      },
      budget: {
        title: 'Budget Constraint',
        formula: 'C_direct + C_indirect ≤ {budget}',
        explain: 'Explanation: Total cost must not exceed budget'
      },
      duration: {
        title: 'Duration Constraint',
        formula: 'T = {duration}',
        explain: 'Explanation: Project must be completed within specified duration'
      },
      variable: {
        title: 'Variable Restrictions',
        explain: 'All start times and durations must be non-negative integers, crash decisions are binary variables'
      }
    },
    
    // Solution Method
    solutionMethod: 'IV. Solution Method and Results',
    solver: {
      title: 'Solver:',
      name: 'PuLP + CBC (COIN-OR Branch and Cut)',
      desc: 'CBC is an open-source mixed integer linear programming solver that uses Branch and Bound with Cutting Plane methods to solve MILP problems.'
    },
    solutionSteps: {
      title: 'Solution Steps:',
      step1: 'Build mathematical model (define variables, objective function, constraints)',
      step2: 'Call CBC solver for optimization calculation',
      step3: 'Extract optimal solution (activity start times, crash decisions, total duration, total cost)',
      step4: 'Calculate penalty/bonus amounts and final cost'
    },
    optimalSolution: {
      title: 'Optimal Solution:',
      duration: 'Optimal Duration: {duration} days',
      directCost: 'Direct Cost: {cost}',
      indirectCost: 'Indirect Cost: {cost}',
      penalty: 'Penalty: {amount}',
      bonus: 'Bonus: {amount}',
      total: 'Total Cost (with Penalty & Bonus): {cost}',
      crashed: 'Crashed Activities: {count} / {total}'
    },
    
    // Conclusion
    conclusion: 'V. Conclusion and Recommendations',
    conclusionText: {
      optimal: 'According to MILP solution results, this is the optimal solution under all constraints.',
      crashed: 'The system recommends crashing {count} activities to achieve the goal.',
      suggestion: 'It is recommended to closely monitor critical path activities during execution to ensure timely project completion.'
    }
  },

  // Charts
  chart: {
    gantt: {
      title: 'Activity Schedule Gantt Chart',
      crashed: 'Crashed',
      normal: 'Normal',
      day: 'Day'
    },
    cost: {
      title: 'Activity Cost Analysis',
      activity: 'Activity',
      cost: 'Cost',
      unit: 'NT$'
    }
  },

  // Optimization Process
  optimizationProcess: {
    title: 'Optimization Calculation Process',
    problemType: {
      title: '1. Problem Type',
      milp: 'Mixed Integer Linear Programming (MILP)',
      description: 'This system uses MILP to solve construction project optimization decision problems. MILP is a mathematical optimization method where some variables are restricted to integers (e.g., start time, duration), and some variables are 0/1 binary variables (e.g., whether to crash).'
    },
    mode: {
      title: '2. Optimization Mode',
      budgetToDuration: 'Mode 1: Given Budget, Minimize Duration',
      durationToCost: 'Mode 2: Given Duration, Minimize Cost',
      budgetConstraint: 'Budget Constraint:',
      durationConstraint: 'Duration Constraint:',
      indirectCost: 'Indirect Cost:',
      targetDuration: 'Target Duration:',
      perDay: ' / day'
    },
    model: {
      title: '3. MILP Mathematical Model',
      variables: {
        title: '3.1 Decision Variables',
        xi: ': Start time of activity i (integer variable, unit: days)',
        yi: ': Whether activity i is crashed (binary variable, 0 = normal, 1 = crashed)',
        t: ': Total project duration (integer variable, unit: days)',
        totalCount: 'Total Variables:',
        continuous: 'Continuous/Integer Variables: {count} ({activityCount} activity start times + 1 total duration)',
        binary: 'Binary Variables: {count} (crash decision for each activity)'
      },
      objective: {
        title: '3.2 Objective Function',
        minimize: 'Objective:',
        totalDuration: 'Total Project Duration',
        penalty: 'Penalty (if T > target duration)',
        bonus: 'Bonus (if T < target duration)',
        directCost: 'Direct Cost',
        indirectCost: 'Indirect Cost',
        totalObjective: 'Total Objective:',
        totalCostWithPenalty: 'Total Cost (with penalty/bonus):',
        explanation: 'Where:'
      },
      constraints: {
        title: '3.3 Constraints',
        precedence: {
          title: 'Precedence Constraints (Total {count})',
          formula: 'x_j ≥ x_i + d_i, ∀ (i, j) ∈ precedence relations',
          description: 'Note: Successor activity j must start ≥ predecessor activity i\'s finish time',
          example: 'Example:',
          exampleItem: '{successor} must start after {predecessor} is completed',
          more: '...total {count} precedence relations'
        },
        duration: {
          title: 'Duration Definition Constraints (Total {count})',
          formula: 'T ≥ x_i + d_i, ∀ i ∈ activity set',
          description: 'Note: Total project duration must be ≥ finish time of all activities'
        },
        budget: {
          title: 'Budget Constraint',
          description: 'Note: Direct cost + indirect cost must not exceed budget'
        },
        fixedDuration: {
          title: 'Duration Constraint (Fixed Duration)',
          description: 'Note: In "Fixed Duration" mode, total project duration T is strictly fixed to your input value'
        },
        bounds: {
          title: 'Variable Range Constraints',
          formula: 'x_i ≥ 0, y_i ∈ {0, 1}, T ≥ 0',
          description: 'Note: Start times and durations are non-negative integers, crash decisions are binary variables'
        }
      }
    },
    solving: {
      title: '4. Solving Process',
      step1: {
        title: 'Build MILP Model',
        description: 'Based on the mathematical model above, the system builds a MILP problem with {varCount} variables and {constraintCount}+ constraints'
      },
      step2: {
        title: 'Invoke CBC Solver',
        description: 'Use COIN-OR Branch and Cut (CBC) solver for solving. CBC is an open-source MILP solver that uses Branch-and-Bound and Cutting Plane methods to solve integer programming problems'
      },
      step3: {
        title: 'Search for Optimal Solution',
        description: 'The solver explores the feasible solution space, using Linear Relaxation and branching strategies to gradually narrow the search range and find the solution that satisfies all constraints with minimum objective value'
      },
      step4: {
        title: 'Verify Optimality',
        description: 'When the solver finds a feasible solution and can prove that the objective value cannot be further improved, it is confirmed as the global optimum'
      },
      step5: {
        title: 'Extract Optimal Solution',
        description: 'Extract optimal values of decision variables from solver:',
        items: [
          'Start time of each activity x_i*',
          'Whether each activity is crashed y_i*',
          'Total project duration T*'
        ]
      },
      step6: {
        title: 'Calculate Result Metrics',
        description: 'Calculate costs and penalties based on optimal solution:',
        items: [
          'Direct cost = Σ [selected activity costs]',
          'Indirect cost = indirect cost rate × T*',
          'Penalty/Bonus (based on actual vs target duration)'
        ]
      },
      completionTime: 'Solution Time:',
      milliseconds: 'ms'
    },
    results: {
      title: '5. Detailed Optimal Solution',
      optimalDuration: 'Optimal Duration (T*)',
      directCost: 'Direct Cost',
      indirectCost: 'Indirect Cost',
      penalty: 'Penalty',
      bonus: 'Bonus',
      totalCost: 'Total Cost (with penalty/bonus)',
      decisions: {
        title: '5.1 Activity Crash Decisions (y_i*)',
        normal: 'Normal:',
        crashed: 'Crashed:',
        activities: 'activities',
        activityName: 'Activity Name',
        startTime: 'Start Time (x_i*)',
        endTime: 'End Time',
        duration: 'Duration (d_i*)',
        decision: 'Crash Decision (y_i*)',
        cost: 'Activity Cost',
        day: 'Day {day}',
        days: '{days} days',
        decisionCrashed: '1 (Crashed)',
        decisionNormal: '0 (Normal)'
      },
      breakdown: {
        title: '5.2 Cost Breakdown',
        directCostLabel: 'Direct Cost:',
        indirectCostLabel: 'Indirect Cost:',
        penaltyLabel: 'Penalty:',
        bonusLabel: 'Bonus:',
        totalLabel: 'Total Cost:',
        penaltyFixed: 'Penalty = Daily amount × Delay days',
        penaltyRate: 'Penalty = Contract amount × Penalty rate × Delay days',
        bonusFormula: 'Bonus = Contract amount × Early days ÷ Contract duration × 5%',
        capReached: '(Cap reached: {percent}% of contract amount)'
      }
    },
    optimality: {
      title: '6. Optimality Guarantee',
      global: {
        title: 'Global Optimal Solution:',
        description: 'CBC solver uses exact algorithms (Branch-and-Bound), guaranteeing that the solution found is a global optimum, not a local optimum'
      },
      feasibility: {
        title: 'Feasibility Verification:',
        description: 'All constraints are satisfied, including precedence relations, duration/budget constraints, etc.'
      },
      optimal: {
        title: 'Objective Value Optimality:',
        descriptionDuration: 'Under all constraints, the objective function value (duration + penalty/bonus) has reached the theoretical minimum and cannot be further improved',
        descriptionCost: 'Under all constraints, the objective function value (total cost + penalty/bonus) has reached the theoretical minimum and cannot be further improved'
      }
    }
  },

  // Error Messages
  error: {
    networkError: 'Network error, please check connection',
    serverError: 'Server error, please try again later',
    unauthorized: 'Unauthorized, please login again',
    notFound: 'Resource not found',
    validationError: 'Data validation failed',
    unknownError: 'Unknown error'
  }
}

