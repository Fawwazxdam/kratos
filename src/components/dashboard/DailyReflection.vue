<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  note: string
}>()

const emit = defineEmits<{
  save: [note: string]
}>()

const isEditing = ref(false)
const draft = ref('')

watch(() => props.note, (val) => {
  draft.value = val
}, { immediate: true })

function startEdit() {
  draft.value = props.note
  isEditing.value = true
}

function save() {
  emit('save', draft.value.trim())
  isEditing.value = false
}

function cancel() {
  draft.value = props.note
  isEditing.value = false
}
</script>

<template>
  <div class="rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/80 to-purple-50/50 p-5 shadow-sm transition-shadow hover:shadow-md dark:border-indigo-800/40 dark:from-indigo-950/30 dark:to-purple-950/20 dark:hover:shadow-lg dark:hover:shadow-black/20">
    <div class="mb-3 flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm dark:bg-indigo-900/40">📝</span>
        <h3 class="text-sm font-semibold text-indigo-700 dark:text-indigo-400">Daily Reflection</h3>
      </div>
      <button
        v-if="!isEditing"
        class="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-indigo-400 transition-colors hover:bg-indigo-100 hover:text-indigo-600 dark:text-indigo-500 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-300"
        @click="startEdit"
      >
        {{ note ? 'Edit' : 'Tulis' }}
      </button>
    </div>

    <div v-if="isEditing" class="space-y-3">
      <textarea
        v-model="draft"
        rows="3"
        placeholder="Refleksi hari ini... apa yang sudah dilakukan? apa yang perlu diperbaiki?"
        class="w-full resize-none overflow-hidden rounded-xl border border-indigo-200 bg-white/80 px-3 py-2.5 text-sm text-indigo-800 placeholder-indigo-300 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-indigo-800/50 dark:bg-gray-800/80 dark:text-indigo-200 dark:placeholder-indigo-600 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/50"
      />
      <div class="flex justify-end gap-2">
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-500 transition-colors hover:bg-indigo-100 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
          @click="cancel"
        >
          Batal
        </button>
        <button
          type="button"
          class="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95"
          @click="save"
        >
          Simpan
        </button>
      </div>
    </div>

    <p v-else-if="note" class="text-sm leading-relaxed text-indigo-800 italic dark:text-indigo-300">"{{ note }}"</p>
    <p v-else class="py-4 text-center text-sm text-indigo-300 italic dark:text-indigo-600">Belum ada refleksi hari ini.</p>
  </div>
</template>
