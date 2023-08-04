import { defineStore } from 'pinia'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [
      { id: 1, title: 'do laundry', isFav: false },
      { id: 2, title: 'play tennis', isFav: true }
    ]
  })
})
