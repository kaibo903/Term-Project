-- 新增趕工費用計算方式相關欄位

-- 在投標情境表中新增契約工期欄位（用於計算趕工費用）
ALTER TABLE bidding_scenarios 
ADD COLUMN IF NOT EXISTS contract_duration INTEGER;  -- 契約工期（天，用於計算趕工費用）

-- 注意：趕工費用計算方式為：
-- 每日趕工費用 = (契約決標總價 / 契約工期) × 15%
-- 趕工費用上限 = 契約決標總價 × 3%
-- 此計算在應用層進行，因為需要動態計算

