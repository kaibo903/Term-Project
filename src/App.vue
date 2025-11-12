<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from './lib/supabase';

const status = ref<'checking'|'ok'|'error'>('checking');
const rows = ref<{ id:number; created_at:string; note:string|null }[]>([]);
const newNote = ref('');
const message = ref('');

async function checkConnection() {
  // 用最安全通用的方式：對 ping 表做一次輕量查詢
  const { error } = await supabase.from('ping').select('id').limit(1);
  if (error) {
    status.value = 'error';
    message.value = error.message;
    return;
  }
  status.value = 'ok';
  await loadRows();
}

async function loadRows() {
  const { data, error } = await supabase
    .from('ping')
    .select('*')
    .order('id', { ascending: false })
    .limit(10);

  if (!error && data) rows.value = data as any;
}

async function addRow() {
  if (!newNote.value.trim()) return;
  const { error } = await supabase.from('ping').insert({ note: newNote.value.trim() });
  if (error) {
    alert(error.message);
    return;
  }
  newNote.value = '';
  await loadRows();
}

onMounted(checkConnection);
</script>

<template>
  <main style="max-width:720px;margin:40px auto;padding:24px;font-family:system-ui, sans-serif;">
    <h1>Vue + Supabase 健康檢查</h1>

    <p v-if="status==='checking'">正在檢查 Supabase 連線…</p>
    <p v-else-if="status==='ok'">✅ 已連線成功</p>
    <p v-else>❌ 連線失敗（{{ message }}）</p>

    <section style="margin-top:24px;">
      <h2>新增一筆測試資料</h2>
      <div style="display:flex;gap:8px;">
        <input v-model="newNote" placeholder="輸入 note…" style="flex:1;padding:8px;border:1px solid #ddd;border-radius:8px;">
        <button @click="addRow" style="padding:8px 12px;border-radius:8px;">新增</button>
      </div>
    </section>

    <section style="margin-top:24px;">
      <h2>最近 10 筆</h2>
      <ul>
        <li v-for="r in rows" :key="r.id">
          <code>#{{ r.id }}</code> — {{ r.created_at }} — {{ r.note }}
        </li>
      </ul>
    </section>

    <hr style="margin:24px 0;">
    <small>本機與 Vercel 的差別通常只在環境變數與 CORS 來源。</small>
  </main>
</template>

<style>
html,body,#app{height:100%;margin:0}
</style>
