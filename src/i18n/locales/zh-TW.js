// 繁體中文語言包
export default {
  // 通用
  common: {
    confirm: '確定',
    cancel: '取消',
    save: '儲存',
    delete: '刪除',
    edit: '編輯',
    add: '新增',
    search: '搜尋',
    reset: '重設',
    submit: '提交',
    close: '關閉',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    loading: '載入中...',
    noData: '暫無資料',
    success: '成功',
    error: '錯誤',
    warning: '警告',
    info: '資訊',
    yes: '是',
    no: '否',
    all: '全部',
    none: '無',
    days: '天',
    currency: 'NT$',
    daysUnit: '（天）',
    currencyUnit: '（NT$）',
    noChartData: '沒有資料可顯示',
    languageChangeSuccess: '語言切換成功'
  },

  // 導航
  nav: {
    home: '首頁',
    projectManagement: '專案管理',
    optimization: '進度成本最佳化',
    results: '結果分析',
    admin: '管理員'
  },

  // 專案管理
  project: {
    title: '專案管理',
    create: '新增專案',
    edit: '編輯專案',
    delete: '刪除專案',
    name: '專案名稱',
    description: '描述',
    status: '專案狀態',
    createdAt: '建立時間',
    actions: '操作',
    manageActivities: '管理作業',
    emptyText: '暫無專案資料，請點擊「新增專案」建立第一個專案',
    namePlaceholder: '請輸入專案名稱',
    descriptionPlaceholder: '請輸入專案描述',
    deleteConfirm: '確定要刪除專案「{name}」嗎？此操作將刪除所有相關的作業和情境。',
    deleteTitle: '確認刪除',
    createSuccess: '專案建立成功',
    updateSuccess: '專案更新成功',
    deleteSuccess: '專案已刪除',
    loadError: '載入專案列表失敗：{error}',
    saveError: '儲存失敗：{error}',
    deleteError: '刪除失敗：{error}',
    nameRequired: '請輸入專案名稱',
    status: {
      draft: '草稿',
      active: '進行中',
      completed: '已完成'
    }
  },

  // 作業活動
  activity: {
    title: '作業活動管理',
    create: '新增作業',
    edit: '編輯作業',
    delete: '刪除作業',
    name: '作業名稱',
    description: '描述',
    normalDuration: '正常工期',
    crashDuration: '趕工工期',
    normalCost: '正常成本',
    crashCost: '趕工成本',
    predecessors: '前置作業',
    successors: '後續作業',
    actions: '操作',
    csvImport: 'CSV 匯入',
    emptyText: '暫無作業資料',
    namePlaceholder: '請輸入作業名稱',
    selectPredecessors: '請選擇',
    noPredecessors: '無',
    multiple: '（可多選）',
    systemDisplay: '（系統顯示）',
    unnamed: '未命名作業',
    // 對話框
    dialogTitle: {
      create: '新增作業',
      edit: '編輯作業'
    },
    formSection: {
      basic: '基本資訊',
      normal: '正常作業',
      crash: '趕工作業',
      relationship: '作業關係'
    },
    placeholder: {
      description: '請輸入作業描述（選填）',
      normalDuration: '請輸入正常工期',
      normalCost: '請輸入正常成本',
      crashDuration: '請輸入趕工工期',
      crashCost: '請輸入趕工成本',
      predecessors: '請選擇前置作業（選填）'
    },
    deleteConfirm: '確定要刪除作業「{name}」嗎？',
    deleteTitle: '確認刪除',
    createSuccess: '作業新增成功',
    updateSuccess: '作業更新成功',
    deleteSuccess: '作業已刪除',
    loadError: '載入作業列表失敗：{error}',
    saveError: '儲存失敗：{error}',
    deleteError: '刪除失敗：{error}',
    validationError: {
      nameRequired: '請輸入作業名稱',
      durationRequired: '請輸入工期',
      costRequired: '請輸入成本',
      crashDurationInvalid: '趕工工期必須小於等於正常工期',
      crashCostInvalid: '趕工成本必須大於等於正常成本'
    },
    csvImportDialog: {
      title: 'CSV 匯入作業',
      selectFile: '選擇檔案',
      downloadTemplate: '下載 CSV 範本',
      instructionsTitle: '匯入說明',
      instruction1: 'CSV 檔案需包含以下欄位：作業名稱、正常工期、正常成本、趕工工期、趕工成本',
      instruction2: '選填欄位：描述、前置作業（多個前置作業請用逗號分隔作業名稱）',
      instruction3: '第一行為標題列，系統會自動識別欄位名稱',
      instruction4: '支援 UTF-8 和 Big5 編碼',
      dragText: '將 CSV 檔案拖到此處，或',
      clickText: '點擊上傳',
      fileFormatTip: '僅支援 CSV 檔案格式',
      previewTitle: '預覽資料（前 5 筆）',
      totalRecords: '共 {count} 筆資料',
      errorTitle: '錯誤訊息',
      startImport: '開始匯入',
      uploadInstruction: '請上傳包含作業資料的 CSV 檔案',
      fileFormat: '檔案格式要求',
      formatDesc: 'CSV 檔案必須包含以下欄位：',
      fields: {
        name: '作業名稱（必填）',
        normalDuration: '正常工期（必填，整數）',
        crashDuration: '趕工工期（必填，整數，≤ 正常工期）',
        normalCost: '正常成本（必填，數字）',
        crashCost: '趕工成本（必填，數字，≥ 正常成本）',
        predecessors: '前置作業（選填，用分號分隔作業名稱）'
      },
      example: '範例',
      importSuccess: '成功匯入 {count} 筆作業',
      importSuccessWithFail: '成功匯入 {successCount} 筆作業，{failCount} 筆失敗',
      importAllFailed: '所有作業匯入失敗',
      importError: '匯入過程發生錯誤：{error}',
      importItemError: '匯入「{name}」失敗：{error}',
      parseError: '解析 CSV 失敗：{error}',
      parseSuccess: '成功解析 {count} 筆作業資料',
      noValidData: '未找到有效的作業資料',
      noFile: '沒有可匯入的資料'
    }
  },

  // 投標最佳化
  optimization: {
    title: '進度成本最佳化決策',
    subtitle: '輸入專案條件，系統將自動計算最佳工期與成本方案',
    settings: '參數設定',
    results: '計算結果',
    calculate: '開始計算',
    calculating: '計算中...',
    basicInfo: '基本資訊',
    penaltySettings: '獎懲設定',
    
    // 基本設定
    selectProject: '選擇專案',
    selectProjectPlaceholder: '請選擇專案',
    mode: '計算模式',
    budgetFixed: '預算固定',
    durationFixed: '工期固定',
    budgetConstraint: '預算上限',
    durationConstraint: '必須完成天數',
    budgetPlaceholder: '請輸入預算上限',
    durationPlaceholder: '請輸入必須完成的天數',
    indirectCost: '每日間接成本',
    indirectCostPlaceholder: '請輸入每日間接成本',
    
    // 獎懲設定
    penaltyType: '違約金計算方式',
    penaltyTypeFixed: '定額',
    penaltyTypeRate: '比率',
    penaltyAmount: '每日違約金',
    penaltyRate: '違約金比率',
    penaltyAmountPlaceholder: '請輸入每日違約金',
    penaltyRatePlaceholder: '請輸入違約金比率',
    contractAmount: '契約決標總價',
    contractAmountPlaceholder: '請輸入契約決標總價',
    contractDuration: '契約工期',
    contractDurationPlaceholder: '請輸入契約工期',
    targetDuration: '目標完成天數',
    targetDurationPlaceholder: '請輸入目標完成天數（可選）',
    
    // 計算說明
    penaltyCalculation: {
      title: '逾期違約金計算方式',
      fixed: '定額計算：每日固定金額 × 逾期天數',
      rate: '比率計算：契約金額 × 違約金比率 × 逾期天數',
      limit: '違約金上限：契約價金總額的 20%'
    },
    bonusCalculation: {
      title: '趕工獎金計算方式',
      formula: '計算公式：',
      formulaText: '趕工獎金 = 合約總價 × 提前之工期 ÷ 契約工期 × 5%',
      example: '範例：合約總價 1000 萬，契約工期 100 天，提前 10 天完成',
      exampleCalc: '趕工獎金 = 10,000,000 × 10 ÷ 100 × 5% = 50,000',
      limit: '趕工獎金上限：合約總價的 1%'
    },
    
    // 計算結果
    noResults: '尚未進行計算',
    noResultsDesc: '請在左側完成設定後，點擊「開始計算」按鈕',
    optimalDuration: '建議工期',
    directCost: '直接成本',
    indirectCostTotal: '間接成本',
    totalCost: '總成本',
    totalCostNote: '（含獎懲）',
    penaltyAmount: '逾期違約金',
    bonusAmount: '提前完成趕工獎金',
    penaltyLimit: '上限：{amount}（契約總額 20%）',
    bonusLimit: '上限：{amount}（契約總價 1%）',
    
    // 結果摘要
    resultSummary: '最佳化結果摘要',
    summaryText: '計算完成！系統已使用混合整數線性規劃（MILP）求解出最佳方案。',
    costBreakdown: '成本明細',
    costFormula: {
      direct: '直接成本：{amount}',
      indirect: '＋ 間接成本：{amount}',
      penalty: '＋ 違約金：{amount}',
      bonus: '− 趕工獎金：{amount}',
      total: '＝ 總成本（含獎懲）：{amount}'
    },
    crashedActivities: '系統從專案的 {total} 個作業中，自動選擇 {crashed} 個作業進行壓縮（縮短工期、提高趕工成本），並重新排程每一個作業的開始與結束時間，使得上述目標函數達到最佳值。',
    detailTip: '想了解詳細的數學模型與計算過程？請點擊下方「查看詳細結果與圖表」按鈕，在結果分析頁面中有完整的 MILP 數學推導與一步一步的計算說明。',
    
    // 作業排程
    scheduleDetail: '詳細作業排程',
    crashedInfo: '壓縮的作業項目（{count} 項）',
    activityName: '作業名稱',
    startTime: '開始',
    endTime: '結束',
    duration: '工期',
    cost: '成本',
    status: '狀態',
    crashed: '已壓縮',
    normal: '正常',
    
    // 操作
    viewDetails: '查看詳細結果與圖表',
    
    // 驗證
    validation: {
      projectRequired: '請選擇專案',
      modeRequired: '請選擇決策模式',
      budgetRequired: '請輸入預算約束',
      durationRequired: '請輸入工期約束'
    },
    
    // 訊息
    success: '優化計算完成',
    error: '優化計算失敗：{error}',
    resetSuccess: '表單已重置',
    loadProjectsError: '載入專案列表失敗：{error}'
  },

  // 結果分析
  results: {
    title: '優化結果分析',
    exportPDF: '匯出 PDF',
    exportExcel: '匯出 Excel',
    exportingPDF: '匯出中...',
    exportingExcel: '匯出中...',
    
    // 摘要
    summary: {
      optimalDuration: '最優工期',
      optimalCost: '最優成本',
      penaltyAmount: '違約金',
      bonusAmount: '獎金',
      totalCost: '總成本（含獎懲）'
    },
    
    // 圖表
    ganttChart: '作業排程甘特圖',
    costAnalysis: '成本分析',
    scheduleDetail: '作業排程明細',
    
    // 表格欄位
    activityName: '作業名稱',
    startTime: '開始時間（天）',
    endTime: '結束時間（天）',
    duration: '工期（天）',
    crashed: '是否趕工',
    cost: '成本',
    yes: '是',
    no: '否',
    
    // 訊息
    noResults: '沒有找到優化結果',
    loadError: '載入優化結果失敗：{error}',
    exportPDFSuccess: 'PDF 匯出成功',
    exportPDFError: 'PDF 匯出失敗：{error}',
    exportExcelSuccess: 'Excel 匯出成功',
    exportExcelError: 'Excel 匯出失敗：{error}',
    noDataToExport: '沒有可匯出的結果',
    missingResultId: '請提供優化結果 ID'
  },

  // 最佳化過程說明
  process: {
    title: '最佳化計算過程說明',
    
    // 問題類型
    problemType: '一、問題類型',
    milp: '混合整數線性規劃（Mixed Integer Linear Programming, MILP）',
    milpDesc: '本系統使用 MILP 求解營造專案的最佳化決策問題。MILP 是一種數學優化方法，其中部分變數限制為整數（如開始時間、工期），部分變數為 0/1 二元變數（如是否趕工）。',
    
    // 優化模式
    optimizationMode: '二、優化模式',
    mode1: '模式一：給定預算，求最短工期',
    mode2: '模式二：給定工期，求最低成本',
    constraints: {
      budget: '預算約束：',
      duration: '工期約束：',
      indirect: '間接成本：',
      target: '目標工期：',
      perDay: '/ 天'
    },
    
    // 數學模型
    mathModel: '三、MILP 數學模型',
    
    // 決策變數
    decisionVariables: '3.1 決策變數',
    variables: {
      startTime: '：作業 i 的開始時間（整數變數，單位：天）',
      crashed: '：作業 i 是否趕工（二元變數，0 = 正常施工，1 = 趕工）',
      totalDuration: '：專案總工期（整數變數，單位：天）'
    },
    variableCount: '變數總數：',
    variableDetails: {
      continuous: '連續/整數變數：{count} 個（{activities} 個作業開始時間 + 1 個總工期）',
      binary: '二元變數：{count} 個（每個作業的趕工決策）'
    },
    
    // 目標函數
    objective: '3.2 目標函數',
    objectiveGoal: '目標：',
    objectiveWhere: '其中：',
    objectiveItems: {
      duration: '專案總工期',
      directCost: '直接成本',
      indirectCost: '間接成本',
      penalty: '違約金（若 T > 目標工期）',
      bonus: '趕工獎金（若 T < 目標工期）'
    },
    totalObjective: '總目標值：',
    totalCostWithPenalty: '總成本（含獎懲）：',
    
    // 限制式
    constraints_section: '3.3 限制式',
    constraintTypes: {
      precedence: {
        title: '前置作業約束（共 {count} 條）',
        formula: 'x_j ≥ x_i + d_i, ∀ (i, j) ∈ 前置關係',
        desc: '其中 d_i = d_i,正常 × (1 - y_i) + d_i,趕工 × y_i',
        explain: '說明：後續作業 j 的開始時間必須 ≥ 前置作業 i 的結束時間',
        example: '範例：',
        exampleText: '{successor} 必須在 {predecessor} 完成後才能開始',
        more: '...等共 {count} 條前置關係'
      },
      durationDef: {
        title: '工期定義約束（共 {count} 條）',
        formula: 'T ≥ x_i + d_i, ∀ i ∈ 作業集合',
        explain: '說明：專案總工期必須 ≥ 所有作業的結束時間'
      },
      budget: {
        title: '預算約束',
        formula: 'C_直接 + C_間接 ≤ {budget}',
        explain: '說明：總成本不得超過預算'
      },
      duration: {
        title: '工期約束',
        formula: 'T = {duration}',
        explain: '說明：專案必須在指定工期內完成'
      },
      variable: {
        title: '變數限制',
        explain: '所有開始時間與工期必須為非負整數，趕工決策為二元變數'
      }
    },
    
    // 求解方法
    solutionMethod: '四、求解方法與結果',
    solver: {
      title: '求解器：',
      name: 'PuLP + CBC（COIN-OR Branch and Cut）',
      desc: 'CBC 是一個開源的混合整數線性規劃求解器，採用分支定界法（Branch and Bound）搭配割平面法（Cutting Plane）求解 MILP 問題。'
    },
    solutionSteps: {
      title: '求解步驟：',
      step1: '建立數學模型（定義變數、目標函數、限制式）',
      step2: '調用 CBC 求解器進行最佳化計算',
      step3: '提取最優解（作業開始時間、趕工決策、總工期、總成本）',
      step4: '計算獎懲金額與最終成本'
    },
    optimalSolution: {
      title: '最優解：',
      duration: '最優工期：{duration} 天',
      directCost: '直接成本：{cost}',
      indirectCost: '間接成本：{cost}',
      penalty: '違約金：{amount}',
      bonus: '趕工獎金：{amount}',
      total: '總成本（含獎懲）：{cost}',
      crashed: '壓縮作業數：{count} / {total} 個'
    },
    
    // 結論
    conclusion: '五、結論與建議',
    conclusionText: {
      optimal: '根據 MILP 求解結果，在滿足所有約束條件下，本方案為最優解。',
      crashed: '系統建議對 {count} 個作業進行壓縮（趕工），以達成目標。',
      suggestion: '建議執行時密切監控關鍵路徑作業，確保專案如期完成。'
    }
  },

  // 圖表
  chart: {
    gantt: {
      title: '作業排程甘特圖',
      crashed: '已壓縮',
      normal: '正常',
      day: '天'
    },
    cost: {
      title: '作業成本分析',
      activity: '作業',
      cost: '成本',
      unit: 'NT$'
    }
  },

  // 最佳化過程說明
  optimizationProcess: {
    title: '最佳化計算過程說明',
    problemType: {
      title: '一、問題類型',
      milp: '混合整數線性規劃（Mixed Integer Linear Programming, MILP）',
      description: '本系統使用 MILP 求解營造專案的最佳化決策問題。MILP 是一種數學優化方法，其中部分變數限制為整數（如開始時間、工期），部分變數為 0/1 二元變數（如是否趕工）。'
    },
    mode: {
      title: '二、優化模式',
      budgetToDuration: '模式一：給定預算，求最短工期',
      durationToCost: '模式二：給定工期，求最低成本',
      budgetConstraint: '預算約束：',
      durationConstraint: '工期約束：',
      indirectCost: '間接成本：',
      targetDuration: '目標工期：',
      perDay: '/ 天'
    },
    model: {
      title: '三、MILP 數學模型',
      variables: {
        title: '3.1 決策變數',
        xi: '：作業 i 的開始時間（整數變數，單位：天）',
        yi: '：作業 i 是否趕工（二元變數，0 = 正常施工，1 = 趕工）',
        t: '：專案總工期（整數變數，單位：天）',
        totalCount: '變數總數：',
        continuous: '連續/整數變數：{count} 個（{activityCount} 個作業開始時間 + 1 個總工期）',
        binary: '二元變數：{count} 個（每個作業的趕工決策）'
      },
      objective: {
        title: '3.2 目標函數',
        minimize: '目標：',
        totalDuration: '專案總工期',
        penalty: '違約金（若 T > 目標工期）',
        bonus: '趕工獎金（若 T < 目標工期）',
        directCost: '直接成本',
        indirectCost: '間接成本',
        totalObjective: '總目標值：',
        totalCostWithPenalty: '總成本（含獎懲）：',
        explanation: '其中：'
      },
      constraints: {
        title: '3.3 限制式',
        precedence: {
          title: '前置作業約束（共 {count} 條）',
          formula: 'x_j ≥ x_i + d_i, ∀ (i, j) ∈ 前置關係',
          description: '說明：後續作業 j 的開始時間必須 ≥ 前置作業 i 的結束時間',
          example: '範例：',
          exampleItem: '{successor} 必須在 {predecessor} 完成後才能開始',
          more: '...等共 {count} 條前置關係'
        },
        duration: {
          title: '工期定義約束（共 {count} 條）',
          formula: 'T ≥ x_i + d_i, ∀ i ∈ 作業集合',
          description: '說明：專案總工期必須 ≥ 所有作業的結束時間'
        },
        budget: {
          title: '預算約束',
          description: '說明：直接成本 + 間接成本不得超過預算'
        },
        fixedDuration: {
          title: '工期約束（工期固定）',
          description: '說明：在「工期固定」模式中，專案總工期 T 會被嚴格固定為您輸入的工期值'
        },
        bounds: {
          title: '變數範圍約束',
          formula: 'x_i ≥ 0, y_i ∈ {0, 1}, T ≥ 0',
          description: '說明：開始時間與工期為非負整數，趕工決策為二元變數'
        }
      }
    },
    solving: {
      title: '四、求解過程',
      step1: {
        title: '建立 MILP 模型',
        description: '根據上述數學模型，系統建立包含 {varCount} 個變數、{constraintCount} 條以上限制式的 MILP 問題'
      },
      step2: {
        title: '調用 CBC 求解器',
        description: '使用 COIN-OR Branch and Cut (CBC) 求解器進行求解。CBC 是一個開源的 MILP 求解器，採用分支定界法（Branch-and-Bound）與割平面法（Cutting Plane）求解整數規劃問題'
      },
      step3: {
        title: '搜尋最優解',
        description: '求解器探索可行解空間，透過線性鬆弛（Linear Relaxation）與分支策略，逐步縮小搜尋範圍，尋找滿足所有限制式且目標函數值最小的解'
      },
      step4: {
        title: '驗證最優性',
        description: '當求解器找到一個可行解，且能證明該解的目標值不可能再改善時，即確認為全局最優解（Global Optimum）'
      },
      step5: {
        title: '提取最優解',
        description: '從求解器提取各決策變數的最優值：',
        items: [
          '每個作業的開始時間 x_i*',
          '每個作業是否趕工 y_i*',
          '專案總工期 T*'
        ]
      },
      step6: {
        title: '計算結果指標',
        description: '根據最優解計算各項成本與獎懲：',
        items: [
          '直接成本 = Σ [選定的作業成本]',
          '間接成本 = 間接成本率 × T*',
          '違約金/獎金（根據實際工期與目標工期比較）'
        ]
      },
      completionTime: '求解完成時間：',
      milliseconds: '毫秒'
    },
    results: {
      title: '五、最優解詳細結果',
      optimalDuration: '最優工期（T*）',
      directCost: '直接成本',
      indirectCost: '間接成本',
      penalty: '違約金',
      bonus: '趕工獎金',
      totalCost: '總成本（含獎懲）',
      decisions: {
        title: '5.1 作業趕工決策（y_i*）',
        normal: '正常施工：',
        crashed: '趕工：',
        activities: '項作業',
        activityName: '作業名稱',
        startTime: '開始時間（x_i*）',
        endTime: '結束時間',
        duration: '工期（d_i*）',
        decision: '趕工決策（y_i*）',
        cost: '作業成本',
        day: '第 {day} 天',
        days: '{days} 天',
        decisionCrashed: '1（趕工）',
        decisionNormal: '0（正常）'
      },
      breakdown: {
        title: '5.2 成本計算明細',
        directCostLabel: '直接成本：',
        indirectCostLabel: '間接成本：',
        penaltyLabel: '違約金：',
        bonusLabel: '趕工獎金：',
        totalLabel: '總成本：',
        penaltyFixed: '違約金 = 每日定額 × 延遲天數',
        penaltyRate: '違約金 = 合約總價 × 違約金率 × 延遲天數',
        bonusFormula: '趕工獎金 = 合約總價 × 提前天數 ÷ 合約工期 × 5%',
        capReached: '（已達上限：合約總價的 {percent}%）'
      }
    },
    optimality: {
      title: '六、最優性保證',
      global: {
        title: '全局最優解：',
        description: 'CBC 求解器使用精確演算法（分支定界法），保證找到的解為全局最優解，而非局部最優解'
      },
      feasibility: {
        title: '可行性驗證：',
        description: '所有限制式均已滿足，包括前置關係、工期/預算約束等'
      },
      optimal: {
        title: '目標值最優：',
        descriptionDuration: '在滿足所有限制式的前提下，目標函數值（工期 + 獎懲）已達到理論最小值，無法再進一步改善',
        descriptionCost: '在滿足所有限制式的前提下，目標函數值（總成本 + 獎懲）已達到理論最小值，無法再進一步改善'
      }
    }
  },

  // 錯誤訊息
  error: {
    networkError: '網路錯誤，請檢查連線',
    serverError: '伺服器錯誤，請稍後再試',
    unauthorized: '未授權，請重新登入',
    notFound: '找不到資源',
    validationError: '資料驗證失敗',
    unknownError: '未知錯誤'
  }
}

