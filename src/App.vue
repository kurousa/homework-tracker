<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// Mode Configuration (Defaults to true/Parent Mode)
const isParentMode = ref(true);
const toastMessage = ref('');
const showCelebration = ref(true);

// Fetch localstorage database with defaults
const savedData = localStorage.getItem('family_homework_items');
const homeworks = ref(savedData ? JSON.parse(savedData) : [
  { id: 1, subject: '国語', title: 'かんじドリル 3ページ', is_completed: false },
  { id: 2, subject: '算数', title: 'ぷりんと 1まい', is_completed: true }
]);

// Base model for creating new homeworks
const newHomework = ref({
  subject: '国語',
  customSubject: '',
  title: ''
});

// Inline edit session models
const editingId = ref(null);
const editState = ref({
  subject: '国語',
  customSubject: '',
  title: ''
});

// Watch database to maintain state instantly
watch(homeworks, (newItems) => {
  localStorage.setItem('family_homework_items', JSON.stringify(newItems));
}, { deep: true });

// Update body class for styling
watch(isParentMode, (parentMode) => {
  if (parentMode) {
    document.body.className = 'bg-slate-50 font-professional text-slate-900 min-h-screen antialiased selection:bg-blue-100 theme-transition';
  } else {
    document.body.className = 'bg-amber-50 font-kids text-slate-700 min-h-screen antialiased selection:bg-blue-100 theme-transition';
  }
}, { immediate: true });

// Evaluated stats
const completedCount = computed(() => {
  return homeworks.value.filter(item => item.is_completed).length;
});

const progressPercentage = computed(() => {
  if (homeworks.value.length === 0) return 0;
  return Math.round((completedCount.value / homeworks.value.length) * 100);
});

const allDone = computed(() => {
  return homeworks.value.length > 0 && homeworks.value.every(item => item.is_completed);
});

// Custom stylized system notifications
const triggerToast = (msg) => {
  toastMessage.value = msg;
  setTimeout(() => {
    toastMessage.value = '';
  }, 3500);
};

// Form registration trigger
const addHomework = () => {
  const finalSubject = newHomework.value.subject === 'その他' 
    ? newHomework.value.customSubject.trim() 
    : newHomework.value.subject;

  if (!finalSubject) {
    triggerToast('システムエラー: 教科名を入力してください。');
    return;
  }

  if (!newHomework.value.title.trim()) {
    triggerToast('システムエラー: 宿題の内容を正しく入力してください。');
    return;
  }
  
  homeworks.value.push({
    id: Date.now(),
    subject: finalSubject,
    title: newHomework.value.title.trim(),
    is_completed: false
  });

  // Form reset
  newHomework.value.title = '';
  newHomework.value.customSubject = '';
  newHomework.value.subject = '国語';
  triggerToast('システムログ: 新規宿題をデータベースに追加しました。');
};

// Start inline editing of a homework item
const startEdit = (item) => {
  editingId.value = item.id;
  const basicSubjects = ['国語', '算数', '理科', '社会'];
  
  if (basicSubjects.includes(item.subject)) {
    editState.value = {
      subject: item.subject,
      customSubject: '',
      title: item.title
    };
  } else {
    editState.value = {
      subject: 'その他',
      customSubject: item.subject,
      title: item.title
    };
  }
};

// Save inline edited content
const saveEdit = (id) => {
  const finalSubject = editState.value.subject === 'その他' 
    ? editState.value.customSubject.trim() 
    : editState.value.subject;

  if (!finalSubject) {
    triggerToast('システムエラー: 教科名を正しく入力してください。');
    return;
  }

  if (!editState.value.title.trim()) {
    triggerToast('システムエラー: 宿題内容を入力してください。');
    return;
  }

  const index = homeworks.value.findIndex(item => item.id === id);
  if (index !== -1) {
    homeworks.value[index].subject = finalSubject;
    homeworks.value[index].title = editState.value.title.trim();
    triggerToast('システムログ: 宿題データを更新しました。');
  }
  
  editingId.value = null; // Exit edit mode
};

// Cancel editing process
const cancelEdit = () => {
  editingId.value = null;
};

// Database row removal
const deleteHomework = (id) => {
  homeworks.value = homeworks.value.filter(item => item.id !== id);
  triggerToast('システムログ: 宿題データベースから削除しました。');
};

// State switcher toggle
const toggleComplete = (item) => {
  item.is_completed = !item.is_completed;
  
  // Re-enable validation for celebration screen triggers
  if (!item.is_completed) {
    showCelebration.value = true;
  }
};

// Switch modes with clean styling transitions
const toggleMode = () => {
  isParentMode.value = !isParentMode.value;
  cancelEdit(); // Close any open editor when toggling modes
};

// Mapping style packages by subject and view type
const getSubjectStyles = (subject) => {
  switch(subject) {
    case '国語':
      return { 
        bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300',
        parentBg: 'bg-rose-50', parentText: 'text-rose-700 border-rose-200'
      };
    case '算数':
      return { 
        bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-300',
        parentBg: 'bg-sky-50', parentText: 'text-sky-700 border-sky-200'
      };
    case '理科':
      return { 
        bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300',
        parentBg: 'bg-emerald-50', parentText: 'text-emerald-700 border-emerald-200'
      };
    case '社会':
      return { 
        bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300',
        parentBg: 'bg-amber-50', parentText: 'text-amber-700 border-amber-200'
      };
    default:
      return { 
        bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300',
        parentBg: 'bg-purple-50', parentText: 'text-purple-700 border-purple-200'
      };
  }
};

// Celebration confetti rendering
const fireConfetti = () => {
  const duration = 2.5 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    if (window.confetti) {
      window.confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#3b82f6', '#f43f5e', '#fbbf24']
      });
      window.confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#3b82f6', '#f43f5e', '#fbbf24']
      });
    }

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};

// Trigger confetti upon detecting child completing final homework
watch(allDone, (isFinished) => {
  if (isFinished && !isParentMode.value) {
    fireConfetti();
  }
});

const reFireConfetti = () => {
  fireConfetti();
};

</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-6 md:py-10 flex flex-col min-h-screen">
    
    <!-- Stylized Toast Notification (Replaces native alerts) -->
    <div v-if="toastMessage" 
         :class="[isParentMode ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-rose-500 text-white', 'fixed top-5 left-1/2 -translate-x-1/2 z-50 font-bold py-3 px-6 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-300 transform translate-y-0']">
      <i :class="isParentMode ? 'fa-solid fa-bell text-blue-400' : 'fa-solid fa-circle-exclamation text-lg'"></i>
      <span class="text-sm tracking-wide">{{ toastMessage }}</span>
    </div>

    <!-- Header: Swaps styling dynamically between crisp Admin console and cute child header -->
    <header :class="[
      isParentMode 
        ? 'bg-white border border-slate-200 rounded-lg shadow-sm p-4 mb-6' 
        : 'bg-white rounded-3xl p-5 shadow-sm border-4 border-amber-200 mb-6'
    , 'theme-transition']">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <!-- Header Left Info -->
        <div class="flex items-center space-x-3 text-center sm:text-left">
          <div :class="[isParentMode ? 'bg-slate-100 text-slate-600 rounded-md p-2 text-lg' : 'bg-emerald-100 text-emerald-600 p-3 rounded-2xl text-2xl']">
            <i :class="isParentMode ? 'fa-solid fa-gear' : 'fa-solid fa-pencil-alt'"></i>
          </div>
          <div>
            <span :class="[isParentMode ? 'text-slate-400 text-[10px]' : 'text-amber-500 text-xs', 'font-bold tracking-wider block']">
              {{ isParentMode ? 'ADMINISTRATION CONSOLE' : 'STUDENT DASHBOARD' }}
            </span>
            <h1 :class="[isParentMode ? 'text-lg font-bold text-slate-800 tracking-tight' : 'text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight']">
              {{ isParentMode ? '保護者用 宿題管理システム' : 'きょうのしゅくだい' }}
            </h1>
          </div>
        </div>
        
        <!-- Mode Switcher button with distinct styling for parent/child -->
        <button @click="toggleMode" 
                :class="[
                  isParentMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-md shadow-sm transition-colors'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-extrabold px-5 py-3 rounded-2xl shadow-[0_4px_0_0_#d97706] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#d97706] active:translate-y-[4px] active:shadow-none transition-all duration-100'
                , 'flex items-center space-x-2']">
          <span>{{ isParentMode ? '👦 子ども画面へ切り替え' : '👩 保護者メニューに戻る' }}</span>
        </button>
      </div>
    </header>

    <main class="flex-grow">
      
      <!-- ======================================================= -->
      <!-- PARENT MODE SECTION (CRISP, SYSTEMATIC, DASHBOARD LIKE) -->
      <!-- ======================================================= -->
      <section v-if="isParentMode" class="space-y-6">
        
        <!-- Two-column dashboard layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Column 1: Homework Registrator Form (Left side) -->
          <div class="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4 h-fit">
            <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h2 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center">
                <i class="fa-solid fa-circle-plus text-blue-500 mr-2"></i>新規登録フォーム
              </h2>
              <span class="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">HOMEWORK_REGISTRATOR</span>
            </div>
            
            <div class="space-y-3">
              <!-- Subject Dropdown -->
              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-1">対象教科</label>
                <div class="relative">
                  <select v-model="newHomework.subject" 
                          class="w-full bg-white border border-slate-300 rounded text-xs py-2 px-3 text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer">
                    <option value="国語">国語 🟥</option>
                    <option value="算数">算数 🟦</option>
                    <option value="理科">理科 🟩</option>
                    <option value="社会">社会 🟧</option>
                    <option value="その他">その他 🟪</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-[10px]">
                    <i class="fa-solid fa-chevron-down"></i>
                  </div>
                </div>
              </div>

              <!-- Free Input Area for Other Subject (Dynamically visible) -->
              <div v-if="newHomework.subject === 'その他'" class="animate-fade-in">
                <label class="block text-xs font-semibold text-slate-500 mb-1">教科名を入力してください</label>
                <input v-model="newHomework.customSubject" 
                       type="text" 
                       placeholder="例: 英語、音楽、図工" 
                       class="w-full bg-white border border-slate-300 rounded text-xs py-2 px-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>

              <!-- Title Input -->
              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-1">実施内容 (宿題詳細)</label>
                <input v-model="newHomework.title" 
                       @keyup.enter="addHomework"
                       type="text" 
                       placeholder="例: かんじドリル 5ページ、計算カード10分" 
                       class="w-full bg-white border border-slate-300 rounded text-xs py-2 px-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>

            <!-- Registry Button -->
            <button @click="addHomework" 
                    class="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 px-4 rounded shadow-sm transition-colors flex items-center justify-center space-x-2">
              <i class="fa-solid fa-plus text-[10px]"></i>
              <span>宿題をデータベースに追加</span>
            </button>
          </div>

          <!-- Column 2: Dashboard Statistics & Homework Table List (Right side) -->
          <div class="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div class="border-b border-slate-100 pb-3 flex justify-between items-center mb-4">
                <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center">
                  <i class="fa-solid fa-list-check text-slate-500 mr-2"></i>登録宿題一覧・状況
                </h3>
                <span class="text-xs text-slate-500 font-mono">
                  完了: {{ completedCount }} / 総数: {{ homeworks.length }}
                </span>
              </div>

              <!-- Numerical Progress Overview -->
              <div class="mb-4 bg-slate-50 border border-slate-100 p-3 rounded flex justify-between items-center text-xs">
                <div>
                  <span class="text-slate-500">全体完了率:</span>
                  <span class="ml-2 font-bold text-slate-800">{{ progressPercentage }}%</span>
                </div>
                <!-- Mini Progress Bar -->
                <div class="w-1/2 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div class="bg-blue-600 h-full rounded-full transition-all duration-300"
                       :style="{ width: progressPercentage + '%' }"></div>
                </div>
              </div>

              <!-- Empty state inside Dashboard -->
              <div v-if="homeworks.length === 0" class="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded">
                <p class="text-slate-400 text-xs">登録されている宿題が存在しません。</p>
                <p class="text-[10px] text-slate-400 mt-1">新規登録フォームより宿題を追加してください。</p>
              </div>

              <!-- Systematic Data Table -->
              <div v-else class="overflow-hidden border border-slate-200 rounded">
                <table class="w-full text-left text-xs">
                  <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <tr>
                      <th class="py-2.5 px-3">教科</th>
                      <th class="py-2.5 px-3">宿題詳細</th>
                      <th class="py-2.5 px-3 text-center">進捗</th>
                      <th class="py-2.5 px-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="item in homeworks" :key="item.id" class="hover:bg-slate-50 transition-colors">
                      
                      <!-- Normal View State -->
                      <template v-if="editingId !== item.id">
                        <!-- Subject Color Coding tag -->
                        <td class="py-3 px-3">
                          <span :class="[getSubjectStyles(item.subject).parentBg, getSubjectStyles(item.subject).parentText, 'text-[10px] font-bold px-2 py-0.5 rounded border']">
                            {{ item.subject }}
                          </span>
                        </td>
                        <!-- Homework description -->
                        <td class="py-3 px-3 text-slate-700 font-medium" :class="{ 'line-through text-slate-400 font-normal': item.is_completed }">
                          {{ item.title }}
                        </td>
                        <!-- Status Toggle -->
                        <td class="py-3 px-3 text-center">
                          <button @click="toggleComplete(item)"
                                  :class="[
                                    item.is_completed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200',
                                    'text-[10px] font-bold px-2 py-0.5 rounded border transition-colors hover:opacity-80'
                                  ]">
                            {{ item.is_completed ? '完了' : '未完了' }}
                          </button>
                        </td>
                        <!-- Operations (Edit / Delete) -->
                        <td class="py-3 px-3 text-right space-x-1">
                          <button @click="startEdit(item)" 
                                  class="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-slate-100 transition-colors"
                                  title="宿題を編集">
                            <i class="fa-solid fa-pen-to-square text-[11px]"></i>
                          </button>
                          <button @click="deleteHomework(item.id)" 
                                  class="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-colors"
                                  title="宿題を削除">
                            <i class="fa-solid fa-trash-can text-[11px]"></i>
                          </button>
                        </td>
                      </template>

                      <!-- Inline Edit State -->
                      <template v-else>
                        <!-- Edit Subject selection -->
                        <td class="py-3 px-3">
                          <div class="space-y-1">
                            <select v-model="editState.subject" 
                                    class="w-full bg-white border border-slate-300 rounded text-[10px] py-1 px-1.5 text-slate-800 font-medium focus:outline-none focus:border-blue-500">
                              <option value="国語">国語</option>
                              <option value="算数">算数</option>
                              <option value="理科">理科</option>
                              <option value="社会">社会</option>
                              <option value="その他">その他</option>
                            </select>
                            <input v-if="editState.subject === 'その他'"
                                   v-model="editState.customSubject" 
                                   type="text" 
                                   placeholder="教科名"
                                   class="w-full bg-white border border-slate-300 rounded text-[10px] py-1 px-1.5 text-slate-800 focus:outline-none focus:border-blue-500" />
                          </div>
                        </td>
                        <!-- Edit Title details -->
                        <td class="py-3 px-3" colspan="2">
                          <input v-model="editState.title" 
                                 type="text" 
                                 class="w-full bg-white border border-slate-300 rounded text-xs py-1 px-2 text-slate-800 font-medium focus:outline-none focus:border-blue-500" />
                        </td>
                        <!-- Actions to save or cancel -->
                        <td class="py-3 px-3 text-right space-x-1">
                          <button @click="saveEdit(item.id)" 
                                  class="text-emerald-600 hover:text-emerald-800 p-1 rounded hover:bg-emerald-50 transition-colors"
                                  title="保存する">
                            <i class="fa-solid fa-check text-xs font-bold"></i>
                          </button>
                          <button @click="cancelEdit" 
                                  class="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors"
                                  title="キャンセル">
                            <i class="fa-solid fa-xmark text-xs"></i>
                          </button>
                        </td>
                      </template>

                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
              <span>* リアルタイム自動保存が有効です</span>
              <span>システムステータス: オンライン</span>
            </div>
          </div>
          
        </div>
      </section>

      <!-- ======================================================= -->
      <!-- CHILD MODE SECTION (BUBBLY, GAMIFIED, CHILD-FRIENDLY) -->
      <!-- ======================================================= -->
      <section v-if="!isParentMode" class="space-y-6">
        
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
        <div v-if="homeworks.length === 0" class="text-center py-12 px-6 bg-white rounded-3xl border-4 border-emerald-200 shadow-sm flex flex-col items-center justify-center space-y-4">
          <span class="text-6xl animate-bounce">🎉</span>
          <h3 class="text-2xl font-black text-emerald-800">きょうの しゅくだいは ありません！</h3>
          <p class="text-emerald-600 font-bold">おうちの人に、宿題を登録してもらいましょう！</p>
        </div>
        
        <!-- Interactive Checklist Cards -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="item in homeworks" 
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
      </section>
    </main>

    <!-- Celebration Overlay Modal (Visible in Child Mode upon full completion) -->
    <transition name="fade">
      <div v-if="!isParentMode && allDone && homeworks.length > 0 && showCelebration" 
           class="fixed inset-0 bg-white/95 backdrop-blur-md flex flex-col justify-center items-center z-50 p-6 text-center">
        
        <!-- Giant Award Cup -->
        <div class="mb-6 relative">
          <span class="text-8xl md:text-9xl block animate-bounce">🏆</span>
          <span class="absolute -top-3 -right-3 text-4xl animate-ping">✨</span>
          <span class="absolute -bottom-3 -left-3 text-4xl animate-ping delay-300">✨</span>
        </div>

        <h2 class="text-3xl md:text-5xl font-black text-rose-500 tracking-tight leading-snug celebrate-pulse mb-4 font-kids">
          🎉 ぜんぶ できたね！<br>
          すばらしい！ 🎉
        </h2>
        
        <p class="text-slate-600 font-bold max-w-sm mb-8 font-kids">
          きょうの しゅくだいは ぜんぶ おわり！<br>
          おうちの人に みせて、いっぱい ほめてもらおうね！
        </p>

        <!-- Celebration Control Panel -->
        <div class="flex flex-col sm:flex-row gap-4 w-full max-w-xs justify-center font-kids">
          <button @click="reFireConfetti" 
                  class="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-6 rounded-2xl shadow-[0_4px_0_0_#d97706] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center space-x-2">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>もういちど 紙ふぶき！</span>
          </button>
          <button @click="showCelebration = false" 
                  class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-black py-3 px-6 rounded-2xl active:translate-y-1 transition-all">
            閉じる
          </button>
        </div>
      </div>
    </transition>

    <!-- Dynamic Footer Layout -->
    <footer class="mt-8 py-4 text-center text-[11px] text-slate-400 font-medium border-t border-dashed border-slate-200">
      <span v-if="isParentMode" class="font-sans">
        Parental Control System &copy; 2026 - 宿題管理エンジン搭載
      </span>
      <span v-else class="font-kids">
        きょうのしゅくだいアプリ &copy; 2026 ・ 親子でもっと楽しく宿題管理
      </span>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
