import { defineStore } from 'pinia'

const usePartnerStore = defineStore('counter', () => {
  const currentSubInfo = ref({

  })
  const setCurrentSubInfo = (partial) => {
    currentSubInfo.value = { ...partial }
  }

  return {
    currentSubInfo,
    setCurrentSubInfo,
  }
})

export default usePartnerStore
