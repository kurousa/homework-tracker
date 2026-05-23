<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useChildStore } from '@/stores/useChildStore'
import { useHomeworkStore } from '@/stores/useHomeworkStore'
import { useToastStore } from '@/stores/useToastStore'

const childStore = useChildStore()
const homeworkStore = useHomeworkStore()
const toastStore = useToastStore()

const { children, parentSelectedChildId } = storeToRefs(childStore)
const { activeHomeworks, completedCount, progressPercentage } = storeToRefs(homeworkStore)

// Base model for creating new homeworks
const newHomework = ref({
  subject: '国語',
  customSubject: '',
  title: ''
})

// Inline edit session models
const editingId = ref(null)
const editState = ref({
  subject: '国語',
  customSubject: '',
  title: ''
})

const addHomework = () => {
  const finalSubject = newHomework.value.subject === 'その他' 
    ? newHomework.value.customSubject.trim() 
    : newHomework.value.subject

  if (!finalSubject) {
    toastStore.triggerToast('システムエラー: 教科名を入力してください。')
    return
  }

  if (!newHomework.value.title.trim()) {
    toastStore.triggerToast('システムエラー: 宿題の内容を正しく入力してください。')
    return
  }
  
  homeworkStore.addHomework({
    subject: finalSubject,
    title: newHomework.value.title.trim(),
    type: 'homework',
    childId: childStore.activeChildId
  })

  // Form reset
  newHomework.value.title = ''
  newHomework.value.customSubject = ''
  newHomework.value.subject = '国語'
  toastStore.triggerToast('システムログ: 新規宿題をデータベースに追加しました。')
}

const startEdit = (item) => {
  editingId.value = item.id
  const basicSubjects = ['国語', '算数', '理科', '社会']
  
  if (basicSubjects.includes(item.subject)) {
    editState.value = {
      subject: item.subject,
      customSubject: '',
      title: item.title
    }
  } else {
    editState.value = {
      subject: 'その他',
      customSubject: item.subject,
      title: item.title
    }
  }
}

const saveEdit = (id) => {
  const finalSubject = editState.value.subject === 'その他' 
    ? editState.value.customSubject.trim() 
    : editState.value.subject

  if (!finalSubject) {
    toastStore.triggerToast('システムエラー: 教科名を正しく入力してください。')
    return
  }

  if (!editState.value.title.trim()) {
    toastStore.triggerToast('システムエラー: 宿題内容を入力してください。')
    return
  }

  homeworkStore.updateHomework(id, {
    subject: finalSubject,
    title: editState.value.title.trim()
  })
  toastStore.triggerToast('システムログ: 宿題データを更新しました。')
  
  editingId.value = null
}

const cancelEdit = () => {
  editingId.value = null
}

const deleteHomework = (id) => {
  homeworkStore.deleteHomework(id)
  toastStore.triggerToast('システムログ: 宿題データベースから削除しました。')
}

const toggleComplete = (item) => {
  homeworkStore.toggleComplete(item.id)
}

const getSubjectStyles = (subject) => {
  switch(subject) {
    case '国語': return { parentBg: 'bg-rose-50', parentText: 'text-rose-700 border-rose-200' }
    case '算数': return { parentBg: 'bg-sky-50', parentText: 'text-sky-700 border-sky-200' }
    case '理科': return { parentBg: 'bg-emerald-50', parentText: 'text-emerald-700 border-emerald-200' }
    case '社会': return { parentBg: 'bg-amber-50', parentText: 'text-amber-700 border-amber-200' }
    case '読書': return { parentBg: 'bg-indigo-50', parentText: 'text-indigo-700 border-indigo-200' }
    case '体操': return { parentBg: 'bg-orange-50', parentText: 'text-orange-700 border-orange-200' }
    case 'お手伝い': return { parentBg: 'bg-teal-50', parentText: 'text-teal-700 border-teal-200' }
    default: return { parentBg: 'bg-purple-50', parentText: 'text-purple-700 border-purple-200' }
  }
}

// 子ども管理用のリアクティブデータとメソッド
const newChildName = ref('')
const selectedEmoji = ref('👦')
const availableEmojis = ['👦', '👧', '👶', '🐱', '🐶', '🐻', '🐼', '🦁', '🐸', '🐨', '🦊', '🐰']

const handleAddChild = () => {
  const name = newChildName.value.trim()
  if (!name) {
    toastStore.triggerToast('システムエラー: お子様の名前を入力してください。')
    return
  }

  const added = childStore.addChild(name, selectedEmoji.value)
  if (added) {
    toastStore.triggerToast(`システムログ: ${added.name}ちゃんを新しく登録しました。`)
    newChildName.value = ''
    selectedEmoji.value = '👦'
  }
}

const handleDeleteChild = (child) => {
  const confirmed = confirm(`「${child.name}」ちゃんを削除しますか？\n登録されている宿題もすべて削除されます。この操作は取り消せません。`)
  if (confirmed) {
    const success = childStore.deleteChild(child.id)
    if (success) {
      homeworkStore.deleteHomeworksForChild(child.id)
      toastStore.triggerToast(`システムログ: ${child.name}ちゃんを削除しました。`)
    }
  }
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 space-y-0">
    <!-- Column 1: Left side (Homework Registrator & Child Management) -->
    <div class="lg:col-span-5 space-y-6">
      
      <!-- Box 1: Homework Registrator Form -->
      <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
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

          <!-- Free Input Area for Other Subject -->
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

      <!-- Box 2: Child Management Menu -->
      <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center">
            <i class="fa-solid fa-users text-blue-500 mr-2"></i>子ども管理メニュー
          </h2>
          <span class="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">CHILD_MANAGEMENT</span>
        </div>

        <!-- Registered Children List -->
        <div class="space-y-2">
          <label class="block text-xs font-semibold text-slate-500 mb-1">登録されている子ども</label>
          <div class="divide-y divide-slate-100 border border-slate-200 rounded bg-slate-50 p-2 max-h-[160px] overflow-y-auto">
            <div v-for="child in children" :key="child.id" class="flex items-center justify-between py-2 px-2 hover:bg-white rounded transition-colors">
              <div class="flex items-center space-x-2">
                <span class="text-lg">{{ child.icon }}</span>
                <span class="text-xs font-bold text-slate-700">{{ child.name }}</span>
              </div>
              <button @click="handleDeleteChild(child)" 
                      class="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="この子どもを削除">
                <i class="fa-solid fa-trash-can text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Add Child Form -->
        <div class="space-y-3 pt-2">
          <label class="block text-xs font-semibold text-slate-500 mb-1">子どもの新規追加</label>
          
          <!-- Name Input -->
          <div>
            <input v-model="newChildName" 
                   type="text" 
                   placeholder="なまえ (例: たろう)" 
                   class="w-full bg-white border border-slate-300 rounded text-xs py-2 px-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
          </div>

          <!-- Icon Selection -->
          <div>
            <span class="block text-[10px] font-semibold text-slate-400 mb-1">アイコンを選択</span>
            <div class="grid grid-cols-6 gap-2">
              <button v-for="emoji in availableEmojis" 
                      :key="emoji"
                      @click="selectedEmoji = emoji"
                      :class="[
                        selectedEmoji === emoji ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20' : 'bg-white border-slate-200 hover:bg-slate-50',
                        'border rounded p-1 text-base transition-all flex items-center justify-center'
                      ]">
                {{ emoji }}
              </button>
            </div>
          </div>

          <!-- Add Button -->
          <button @click="handleAddChild" 
                  class="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 px-4 rounded shadow-sm transition-colors flex items-center justify-center space-x-2">
            <i class="fa-solid fa-user-plus text-[10px]"></i>
            <span>子どもを登録</span>
          </button>
        </div>
      </div>

    </div>

    <!-- Column 2: Dashboard Statistics & Homework Table List (Right side) -->
    <div class="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
      <div>
        <!-- Child Switcher Tabs for Parent -->
        <div class="flex space-x-2 mb-6 border-b border-slate-200 overflow-x-auto hide-scrollbar">
          <button v-for="child in children" :key="child.id"
                  @click="childStore.selectChild(child.id, true)"
                  :class="[
                    parentSelectedChildId === child.id 
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 font-bold' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
                    'px-4 py-3 text-sm transition-colors rounded-t-lg flex items-center space-x-2 whitespace-nowrap'
                  ]">
            <span class="text-lg">{{ child.icon }}</span>
            <span>{{ child.name }}</span>
          </button>
        </div>

        <div class="border-b border-slate-100 pb-3 flex justify-between items-center mb-4">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center">
            <i class="fa-solid fa-list-check text-slate-500 mr-2"></i>登録宿題一覧・状況
          </h3>
          <span class="text-xs text-slate-500 font-mono">
            完了: {{ completedCount }} / 総数: {{ activeHomeworks.length }}
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
        <div v-if="activeHomeworks.length === 0" class="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded">
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
              <tr v-for="item in activeHomeworks" :key="item.id" class="hover:bg-slate-50 transition-colors">
                
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
</template>
