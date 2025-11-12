-- 新增違約金計算方式相關欄位

-- 在投標情境表中新增違約金計算相關欄位
ALTER TABLE bidding_scenarios 
ADD COLUMN IF NOT EXISTS penalty_type VARCHAR(20) DEFAULT 'rate',  -- 'fixed' 定額 或 'rate' 比率
ADD COLUMN IF NOT EXISTS penalty_amount DECIMAL(15, 2) DEFAULT 0.0,  -- 定額違約金（每日）
ADD COLUMN IF NOT EXISTS penalty_rate DECIMAL(10, 6) DEFAULT 0.0,  -- 比率違約金（每日，契約金額比率）
ADD COLUMN IF NOT EXISTS contract_amount DECIMAL(15, 2) DEFAULT 0.0;  -- 契約價金總額（用於計算上限）

-- 新增約束：違約金上限為契約價金總額的 20%
-- 注意：此約束在應用層檢查，因為需要動態計算

