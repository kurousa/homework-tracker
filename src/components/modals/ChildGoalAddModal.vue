<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'add'])

const childGoalSubject = ref('国語')
const childActionOptions = [
  { name: 'ぷりんと', unit: 'まい' },
  { name: 'ドリル', unit: 'ページ' },
  { name: 'ノート', unit: 'ページ' },
  { name: 'ほん', unit: 'さつ' },
  { name: 'じかん', unit: 'ふん' },
  { name: 'かいすう', unit: 'かい' }
]
const childGoalAction = ref(childActionOptions[0])
const childGoalAmount = ref(1)

const childSubjectOptions = [
  { id: '国語', icon: '📕', label: 'こくご' },
  { id: '算数', icon: '📐', label: 'さんすう' },
  { id: '読書', icon: '📖', label: 'どくしょ' },
  { id: '体操', icon: '🏃', label: 'たいそう' },
  { id: 'お手伝い', icon: '🧹', label: 'おてつだい' },
  { id: 'その他', icon: '💡', label: 'その他' }
]

const incAmount = () => childGoalAmount.value++
const decAmount = () => { if (childGoalAmount.value > 1) childGoalAmount.value-- }

const addChildGoal = () => {
  const title = `${childGoalAction.value.name} ${childGoalAmount.value}${childGoalAction.value.unit}`
  emit('add', {
    subject: childGoalSubject.value,
    title: title
  })
  
  // reset
  childGoalSubject.value = '国語'
  childGoalAction.value = childActionOptions[0]
  childGoalAmount.value = 1
}
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[120] p-4 font-kids">
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border-4 border-amber-300">
      <!-- Header -->
      <div class="bg-amber-100 p-4 text-center border-b-4 border-amber-200">
        <h2 class="text-2xl font-black text-amber-800">じぶんの もくひょう</h2>
        <p class="text-amber-700 font-bold text-sm mt-1">なにを するか えらんでね！</p>
      </div>
      
      <div class="p-6 space-y-6">
        <!-- 1. Subject Selection -->
        <div>
          <label class="block text-lg font-black text-slate-700 mb-3 flex items-center">
            <span class="bg-amber-200 text-amber-800 rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">1</span>
            きょうかを えらぶ
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button v-for="opt in childSubjectOptions" :key="opt.id"
                    @click="childGoalSubject = opt.id"
                    :class="[
                      childGoalSubject === opt.id 
                        ? 'bg-amber-400 border-amber-500 shadow-inner -translate-y-0.5' 
                        : 'bg-white border-slate-200 hover:bg-amber-50 hover:border-amber-300 shadow-sm hover:-translate-y-1',
                      'border-2 rounded-2xl p-3 flex flex-col items-center justify-center transition-all'
                    ]">
              <span class="text-3xl mb-1">{{ opt.icon }}</span>
              <span class="font-bold text-xs" :class="childGoalSubject === opt.id ? 'text-amber-900' : 'text-slate-600'">{{ opt.label }}</span>
            </button>
          </div>
        </div>

        <!-- 2. Action and Amount Selection -->
        <div>
          <label class="block text-lg font-black text-slate-700 mb-3 flex items-center">
            <span class="bg-amber-200 text-amber-800 rounded-full w-6 h-6 inline-flex items-center justify-center text-sm mr-2">2</span>
            どれくらい やる？
          </label>
          
          <div class="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
            <!-- Action selection -->
            <div class="flex flex-wrap gap-2 mb-4 justify-center">
              <button v-for="act in childActionOptions" :key="act.name"
                      @click="childGoalAction = act"
                      :class="[
                        childGoalAction.name === act.name
                          ? 'bg-blue-500 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-blue-50',
                        'border-2 font-bold py-1.5 px-3 rounded-full text-sm transition-colors'
                      ]">
                {{ act.name }}
              </button>
            </div>
            
            <!-- Amount adjuster -->
            <div class="flex items-center justify-center space-x-6">
              <button @click="decAmount" 
                      class="w-12 h-12 rounded-full bg-white border-4 border-rose-200 text-rose-500 hover:bg-rose-50 hover:border-rose-300 flex items-center justify-center text-2xl font-black shadow-sm active:scale-95 transition-transform">
                <i class="fa-solid fa-minus"></i>
              </button>
              
              <div class="text-center min-w-[100px]">
                <div class="text-4xl font-black text-slate-800 tabular-nums">{{ childGoalAmount }}</div>
                <div class="text-sm font-bold text-slate-500">{{ childGoalAction.unit }}</div>
              </div>
              
              <button @click="incAmount" 
                      class="w-12 h-12 rounded-full bg-white border-4 border-emerald-200 text-emerald-500 hover:bg-emerald-50 hover:border-emerald-300 flex items-center justify-center text-2xl font-black shadow-sm active:scale-95 transition-transform">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Result preview -->
        <div class="text-center p-3 bg-amber-50 rounded-xl border-2 border-amber-200">
          <span class="text-amber-800 font-bold">けってい：</span>
          <span class="text-lg font-black text-amber-900 ml-1">
            [{{ childGoalSubject === 'その他' ? 'その他' : childSubjectOptions.find(o => o.id === childGoalSubject)?.label || childGoalSubject }}] {{ childGoalAction.name }} {{ childGoalAmount }}{{ childGoalAction.unit }}
          </span>
        </div>
      </div>
      
      <div class="p-4 bg-slate-50 flex gap-3 border-t-2 border-slate-100">
        <button @click="$emit('close')" class="flex-1 bg-white border-2 border-slate-300 hover:bg-slate-100 text-slate-600 font-black py-3 rounded-xl transition-colors">
          やめる
        </button>
        <button @click="addChildGoal" class="flex-[2] bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 text-white font-black py-3 rounded-xl active:translate-y-1 active:border-b-0 transition-all flex justify-center items-center">
          <i class="fa-solid fa-check mr-2"></i> つくった！
        </button>
      </div>
    </div>
  </div>
</template>
