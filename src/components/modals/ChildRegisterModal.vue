<script setup>
import { ref } from 'vue'
import { useChildStore } from '@/stores/useChildStore'
import { useToastStore } from '@/stores/useToastStore'
import { useAuthStore } from '@/stores/useAuthStore'

const childStore = useChildStore()
const toastStore = useToastStore()
const authStore = useAuthStore()

const props = defineProps({
  isFromChild: {
    type: Boolean,
    default: false
  }
})

const newChildName = ref('')
const selectedEmoji = ref('👦')
const availableEmojis = ['👦', '👧', '👶', '🐱', '🐶', '🐻', '🐼', '🦁', '🐸', '🐨', '🦊', '🐰']

const emit = defineEmits(['back-to-roles', 'close'])

const handleRegister = () => {
  const name = newChildName.value.trim()
  if (!name) {
    toastStore.triggerToast(props.isFromChild ? 'システムエラー: おなまえをいれてね！' : 'システムエラー: お子様の名前を入力してください。')
    return
  }

  const added = childStore.addChild(name, selectedEmoji.value)
  if (added) {
    // 最初の登録時に自動的にお子様を選択状態にする
    childStore.selectChild(added.id, true)
    if (props.isFromChild) {
      authStore.setRole('child')
      emit('close')
    }
    toastStore.triggerToast(`システムログ: ${added.name}ちゃんを登録しました！しゅくだいを登録しましょう。`)
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[110] p-4"
       :class="isFromChild ? 'font-kids' : 'font-professional'">
    <div class="bg-white shadow-xl w-full max-w-md p-6 overflow-hidden transition-all"
         :class="isFromChild ? 'border-4 border-amber-300 rounded-3xl' : 'border border-slate-100 rounded-2xl'">
      
      <!-- Header -->
      <div class="text-center mb-6">
        <template v-if="isFromChild">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-4 animate-bounce">
            <span class="text-3xl">👦</span>
          </div>
          <h2 class="text-2xl font-black text-amber-800">おともだちが いないよ</h2>
          <p class="text-sm font-bold text-slate-500 mt-2 leading-relaxed">
            しゅくだいを はじめるには、<br>
            まずさいしょに おなまえと アイコンを とうろくしてね！
          </p>
        </template>
        <template v-else>
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-4 ring-8 ring-blue-50/50">
            <i class="fa-solid fa-user-plus text-xl"></i>
          </div>
          <h2 class="text-xl font-bold text-slate-800">お子様の初期登録</h2>
          <p class="text-xs text-slate-500 mt-2 leading-relaxed">
            宿題トラッカーへようこそ！<br>
            宿題を登録・管理するために、まず最初のお子様のアカウントを登録しましょう。
          </p>
        </template>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <!-- Name Input -->
        <div>
          <label class="block text-xs font-semibold mb-1.5"
                 :class="isFromChild ? 'text-amber-800 font-bold' : 'text-slate-600'">
            {{ isFromChild ? 'おなまえを おしえてね' : 'お子様のお名前' }}
          </label>
          <input v-model="newChildName" 
                 type="text" 
                 :placeholder="isFromChild ? 'おなまえをいれてね' : 'おなまえ (例: たろう)'" 
                 @keyup.enter="handleRegister"
                 class="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 px-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
        </div>

        <!-- Emoji Grid Selection -->
        <div>
          <label class="block text-xs font-semibold mb-1.5"
                 :class="isFromChild ? 'text-amber-800 font-bold' : 'text-slate-600'">
            {{ isFromChild ? 'すきな アイコンを えらんでね' : 'アイコンを選択' }}
          </label>
          <div class="grid grid-cols-6 gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
            <button v-for="emoji in availableEmojis" 
                    :key="emoji"
                    @click="selectedEmoji = emoji"
                    type="button"
                    :class="[
                      selectedEmoji === emoji 
                        ? (isFromChild ? 'bg-amber-100 border-amber-500 scale-105 shadow-sm ring-2 ring-amber-500/20' : 'bg-blue-100 border-blue-500 scale-105 shadow-sm ring-2 ring-blue-500/20') 
                        : 'bg-white border-slate-200 hover:bg-slate-100',
                      'border rounded-lg p-2 text-lg transition-all flex items-center justify-center aspect-square'
                    ]">
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex flex-col space-y-3">
        <button @click="handleRegister" 
                type="button"
                :class="isFromChild 
                  ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 font-black py-4 px-6 rounded-2xl shadow-[0_4px_0_0_#d97706] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#d97706] active:translate-y-1 active:shadow-none transition-all text-base' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all text-sm'"
                class="w-full flex items-center justify-center space-x-2">
          <i class="fa-solid fa-check text-xs"></i>
          <span>{{ isFromChild ? 'とうろくして はじめる！' : '登録してはじめる' }}</span>
        </button>
        
        <button @click="$emit('back-to-roles')" 
                type="button"
                :class="isFromChild 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-sm' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 font-semibold py-2.5 rounded-lg text-xs border border-slate-200'"
                class="w-full flex items-center justify-center space-x-1 transition-colors">
          <i class="fa-solid fa-arrow-left text-[10px]"></i>
          <span>{{ isFromChild ? 'もどる' : 'だれがつかう？画面に戻る' }}</span>
        </button>
      </div>

    </div>
  </div>
</template>

