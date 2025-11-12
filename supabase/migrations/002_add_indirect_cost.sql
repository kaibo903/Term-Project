-- 新增間接成本欄位到投標情境表和優化結果表

-- 在投標情境表中新增間接成本欄位
ALTER TABLE bidding_scenarios 
ADD COLUMN IF NOT EXISTS indirect_cost DECIMAL(15, 2) DEFAULT 0.0;

-- 在優化結果表中新增間接成本欄位
ALTER TABLE optimization_results 
ADD COLUMN IF NOT EXISTS indirect_cost DECIMAL(15, 2) DEFAULT 0.0;

