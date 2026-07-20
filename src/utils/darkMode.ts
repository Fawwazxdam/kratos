import { ref, watch } from 'vue'

const isDark = ref(false)

function init() {
  const saved = localStorage.getItem('kratos-dark')
  if (saved !== null) {
    isDark.value = saved === 'true'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  apply()
}

function apply() {
  document.documentElement.classList.toggle('dark', isDark.value)
}

function toggle() {
  isDark.value = !isDark.value
}

watch(isDark, (val) => {
  localStorage.setItem('kratos-dark', String(val))
  apply()
})

export function useDarkMode() {
  return { isDark, toggle, init }
}
