import { defineStore } from 'pinia'
import type { ITask } from '../doimain/task/interface'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [
      { id: 1, title: 'do laundry', isFav: false },
      { id: 2, title: 'play tennis', isFav: true },
      { id: 3, title: 'dishes', isFav: false }
    ]
  }),
  getters: {
    favs(): ITask[] {
      return this.tasks.filter((t) => t.isFav)
    },
    favCount(): number {
      return this.tasks.reduce((p, c) => {
        return c.isFav ? p + 1 : p
      }, 0)
    },
    allCount: (state) => {
      return state.tasks.length
    }
  },
  actions: {
    add(task: ITask): void {
      this.tasks.push(task)
    },
    delete(id: number): void {
      this.tasks = this.tasks.filter((t) => t.id !== id)
    },
    toggleFav(id: number): void {
      const task = this.tasks.find((t) => t.id === id)
      if (task) {
        task.isFav = !task.isFav
      }
    }
  }
})
