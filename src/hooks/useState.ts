const globalLoading = ref(true)

const setLoading = (loading:boolean) => {
  globalLoading.value = loading
}

export default function() {
  return {
    globalLoading,
    setLoading
  }
}
