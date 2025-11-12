# 間接成本功能資料庫遷移指南

## 問題說明

新增間接成本功能需要在資料庫中新增 `indirect_cost` 欄位到以下兩個表：
- `bidding_scenarios`（投標情境表）
- `optimization_results`（優化結果表）

## 執行步驟

### 方法一：使用 Supabase Dashboard（推薦）

1. **登入 Supabase Dashboard**
   - 前往 [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - 選擇您的專案

2. **開啟 SQL Editor**
   - 在左側選單中點擊「SQL Editor」
   - 點擊「New query」建立新查詢

3. **執行遷移 SQL**
   - 複製以下 SQL 語句並貼上到編輯器中：

```sql
-- 新增間接成本欄位到投標情境表和優化結果表

-- 在投標情境表中新增間接成本欄位
ALTER TABLE bidding_scenarios 
ADD COLUMN IF NOT EXISTS indirect_cost DECIMAL(15, 2) DEFAULT 0.0;

-- 在優化結果表中新增間接成本欄位
ALTER TABLE optimization_results 
ADD COLUMN IF NOT EXISTS indirect_cost DECIMAL(15, 2) DEFAULT 0.0;
```

4. **執行查詢**
   - 點擊「Run」按鈕執行 SQL
   - 確認執行成功（應該會顯示 "Success. No rows returned"）

### 方法二：使用 Supabase CLI

如果您使用 Supabase CLI 管理遷移：

```bash
# 確保遷移檔案在正確位置
# supabase/migrations/002_add_indirect_cost.sql

# 應用遷移
supabase db push
```

## 驗證遷移

執行以下 SQL 查詢來驗證欄位是否已成功新增：

```sql
-- 檢查 bidding_scenarios 表結構
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'bidding_scenarios'
AND column_name = 'indirect_cost';

-- 檢查 optimization_results 表結構
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'optimization_results'
AND column_name = 'indirect_cost';
```

如果兩個查詢都返回一行結果，表示遷移成功。

## 注意事項

- 此遷移使用 `IF NOT EXISTS`，即使重複執行也不會出錯
- 預設值為 `0.0`，不會影響現有資料
- 執行後需要重新啟動後端服務（如果正在運行）

## 故障排除

如果遇到權限問題：
- 確保使用具有足夠權限的資料庫使用者
- 在 Supabase Dashboard 中，通常使用 `postgres` 角色即可

如果遷移後仍出現錯誤：
- 清除 Supabase 的 schema cache（通常會自動更新）
- 等待幾秒鐘後重試
- 檢查後端日誌以確認錯誤詳情

