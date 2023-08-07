import { defineStore } from 'pinia'
import type { ITask } from '../doimain/task/interface'

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [] as ITask[],
    isLoading: false
  }),
  getters: {
    favs(): ITask[] | undefined {
      if (this.tasks.length > 0) {
        return this.tasks.filter((t) => t.isFav)
      }
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
    async getTasks(): Promise<any> {
      this.isLoading = true
      fetch('https://vue-http-demo-e3fe1-default-rtdb.firebaseio.com/pinia.json')
        .then((res) => {
          if (res.ok) return res.json()
        })
        .then((data) => {
          this.isLoading = false
          const tempTasks: ITask[] = []
          for (const id in data) {
            tempTasks.push({
              id: parseInt(data[id].id),
              title: data[id].title,
              isFav: data[id].isFav
            })
          }
          this.tasks = tempTasks
        })
    },
    addTask(task: ITask): void {
      fetch('https://vue-http-demo-e3fe1-default-rtdb.firebaseio.com/pinia.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: task.id,
          title: task.title,
          isFav: task.isFav
        })
      }).then((res) => {
        if (res.ok) this.getTasks()
      })
    },
    deleteTask(id: number): void {
      fetch(`https://vue-http-demo-e3fe1-default-rtdb.firebaseio.com/pinia.json`, {
        method: 'GET'
      })
        .then((res) => res.json())
        .then((data) => {
          for (const key in data) {
            if (data[key].id === id) {
              fetch(`https://vue-http-demo-e3fe1-default-rtdb.firebaseio.com/pinia/${key}.json`, {
                method: 'DELETE'
              })
                .then((res) => {
                  if (res.ok) {
                    this.tasks = this.tasks.filter((t) => t.id !== id)
                  }
                })
                .catch((err) => {
                  alert(err)
                })
            }
          }
        })
        .catch((err) => {
          alert(err)
        })
    },
    toggleFav(id: number): void {
      const task = this.tasks.find((t) => t.id === id)
      if (task) {
        task.isFav = !task.isFav

        fetch(`https://vue-http-demo-e3fe1-default-rtdb.firebaseio.com/pinia.json`, {
          method: 'GET'
        })
          .then((res) => res.json())
          .then((data) => {
            for (const key in data) {
              if (data[key].id === id) {
                fetch(`https://vue-http-demo-e3fe1-default-rtdb.firebaseio.com/pinia/${key}.json`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    isFav: task.isFav
                  })
                }).catch((err) => {
                  alert(err)
                })
              }
            }
          })
          .catch((err) => {
            alert(err)
          })
      }
    }
  }
})
