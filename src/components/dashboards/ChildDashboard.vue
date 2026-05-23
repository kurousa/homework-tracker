<script setup>
import { storeToRefs } from 'pinia'
import { useHomeworkStore } from '@/stores/useHomeworkStore'

const homeworkStore = useHomeworkStore()
const { activeHomeworks, parentHomeworks, childGoals, progressPercentage } = storeToRefs(homeworkStore)

defineEmits(['openAddGoal'])

const toggleComplete = (item) => {
  homeworkStore.toggleComplete(item.id)
}

const getSubjectStyles = (subject) => {
  switch(subject) {
    case '国語': return { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300' }
    case '算数': return { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-300' }
    case '理科': return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' }
    case '社会': return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' }
    case '読書': return { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' }
    case '体操': return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' }
    case 'お手伝い': return { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' }
    default: return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' }
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Bouncy Progress Bar for Kids -->
    <div class="bg-white rounded-3xl p-5 shadow-sm border-4 border-emerald-200">
      <div class="flex justify-between items-center mb-2">
        <span class="font-black text-emerald-800 text-lg">しゅくだい の すすむぐあい ⭐</span>
        <span class="font-black text-emerald-700 text-xl">{{ progressPercentage }}%</span>
      </div>
      <div class="w-full bg-emerald-50 h-6 rounded-full overflow-hidden border-2 border-emerald-100 p-1">
        <div class="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
             :style="{ width: progressPercentage + '%' }"></div>
      </div>
    </div>

    <!-- No Homework Empty State for Kids -->
    <div v-if="activeHomeworks.length === 0" class="text-center py-12 px-6 bg-white rounded-3xl border-4 border-emerald-200 shadow-sm flex flex-col items-center justify-center space-y-4">
      <span class="text-6xl animate-bounce">🎉</span>
      <h3 class="text-2xl font-black text-emerald-800">きょうの しゅくだいは ありません！</h3>
      <p class="text-emerald-600 font-bold">おうちの人に、宿題を登録してもらいましょう！</p>
      <button @click="$emit('openAddGoal')" class="mt-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-6 rounded-2xl shadow-[0_4px_0_0_#d97706] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center space-x-2">
        <i class="fa-solid fa-star"></i>
        <span>じぶんの もくひょう をつくる</span>
      </button>
    </div>
    
    <!-- Interactive Checklist Cards -->
    <div v-else class="space-y-8">
      
      <!-- Parent Homeworks -->
      <div v-if="parentHomeworks.length > 0">
        <h2 class="text-xl font-black text-slate-700 mb-4 flex items-center">
          <i class="fa-solid fa-book-open text-blue-500 mr-2"></i>
          おうちの人からの しゅくだい
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="item in parentHomeworks" 
               :key="item.id" 
               @click="toggleComplete(item)"
               :class="[
                 item.is_completed ? 'border-emerald-400 bg-emerald-50 shadow-inner translate-y-1' : getSubjectStyles(item.subject).border + ' bg-white shadow-md hover:-translate-y-1',
                 'bounce-card border-4 rounded-3xl p-6 cursor-pointer text-center relative overflow-hidden transition-all duration-200'
               ]">
            
            <!-- Completion Star Icon behind the card -->
            <div v-if="item.is_completed" class="absolute -right-6 -bottom-6 text-6xl opacity-10 text-emerald-500 transform rotate-12">
              <i class="fa-solid fa-star"></i>
            </div>

            <!-- Top Indicator Check status -->
            <div class="flex justify-center mb-3">
              <span v-if="item.is_completed" class="bg-emerald-500 text-white font-black px-4 py-1 rounded-full text-sm shadow-sm flex items-center space-x-1">
                <i class="fa-solid fa-star text-amber-300"></i>
                <span>できた！</span>
              </span>
              <span v-else class="bg-slate-100 text-slate-500 font-black px-4 py-1 rounded-full text-sm border-2 border-slate-200 flex items-center space-x-1">
                <i class="fa-regular fa-circle"></i>
                <span>まだだよ</span>
              </span>
            </div>

            <!-- Subject Tag & Homework Content -->
            <div class="space-y-1">
              <span :class="[getSubjectStyles(item.subject).bg, getSubjectStyles(item.subject).text, 'inline-block text-sm font-black px-4 py-1 rounded-2xl mb-1']">
                {{ item.subject }}
              </span>
              <h3 class="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-normal" 
                  :class="{ 'line-through text-slate-400 opacity-60': item.is_completed }">
                {{ item.title }}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Child Goals -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-black text-slate-700 flex items-center">
            <i class="fa-solid fa-star text-amber-500 mr-2"></i>
            じぶんの とりくみ
          </h2>
          <button @click="$emit('openAddGoal')" class="bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-black py-2 px-4 rounded-xl shadow-[0_4px_0_0_#d97706] active:translate-y-1 active:shadow-none transition-all flex items-center space-x-1">
            <i class="fa-solid fa-plus"></i>
            <span>ついか</span>
          </button>
        </div>
        
        <div v-if="childGoals.length === 0" class="bg-amber-50 rounded-2xl border-2 border-dashed border-amber-200 p-6 text-center">
          <p class="text-amber-700 font-bold mb-2">じぶんで べんきょうや おてつだいを えらんでみよう！</p>
          <button @click="$emit('openAddGoal')" class="text-amber-600 underline font-bold">ここをおして つくる</button>
        </div>
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="item in childGoals" 
               :key="item.id" 
               @click="toggleComplete(item)"
               :class="[
                 item.is_completed ? 'border-amber-400 bg-amber-50 shadow-inner translate-y-1' : getSubjectStyles(item.subject).border + ' bg-white shadow-md hover:-translate-y-1',
                 'bounce-card border-4 rounded-3xl p-6 cursor-pointer text-center relative overflow-hidden transition-all duration-200'
               ]">
            
            <!-- Completion Star Icon behind the card -->
            <div v-if="item.is_completed" class="absolute -right-6 -bottom-6 text-6xl opacity-10 text-amber-500 transform rotate-12">
              <i class="fa-solid fa-star"></i>
            </div>

            <!-- Top Indicator Check status -->
            <div class="flex justify-center mb-3">
              <span v-if="item.is_completed" class="bg-amber-500 text-white font-black px-4 py-1 rounded-full text-sm shadow-sm flex items-center space-x-1">
                <i class="fa-solid fa-star text-yellow-300"></i>
                <span>できた！</span>
              </span>
              <span v-else class="bg-slate-100 text-slate-500 font-black px-4 py-1 rounded-full text-sm border-2 border-slate-200 flex items-center space-x-1">
                <i class="fa-regular fa-circle"></i>
                <span>まだだよ</span>
              </span>
            </div>

            <!-- Subject Tag & Homework Content -->
            <div class="space-y-1">
              <span :class="[getSubjectStyles(item.subject).bg, getSubjectStyles(item.subject).text, 'inline-block text-sm font-black px-4 py-1 rounded-2xl mb-1']">
                {{ item.subject }}
              </span>
              <h3 class="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-normal" 
                  :class="{ 'line-through text-slate-400 opacity-60': item.is_completed }">
                {{ item.title }}
              </h3>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
