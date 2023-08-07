import { defineStore } from 'pinia'
import type { ITask } from '../doimain/task/interface'

const API_URL = 'https://vue-http-demo-e3fe1-default-rtdb.firebaseio.com/pinia'

const taskErrorMessages = {
  fetch: 'Failed to fetch tasks',
  add: 'Failed to add task',
  delete: 'Failed to delete task',
  update: 'Failed to update task'
}

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
      try {
        const response = await fetch(`${API_URL}.json`)
        if (!response.ok) {
          throw new Error(taskErrorMessages.fetch)
        }
        const data = await response.json()
        const tempTasks: ITask[] = []
        for (const id in data) {
          tempTasks.push({
            id: parseInt(data[id].id),
            title: data[id].title,
            isFav: data[id].isFav
          })
        }
        this.tasks = tempTasks
        this.isLoading = false
      } catch (error) {
        alert(error)
      }
    },
    addTask(task: ITask): void {
      this.isLoading = true
      fetch(`${API_URL}.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(taskErrorMessages.add)
          }
          this.isLoading = false
          this.getTasks()
        })
        .catch((error) => {
          alert(error)
        })
    },
    deleteTask(id: number): void {
      fetch(`${API_URL}.json`, {
        method: 'GET'
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(taskErrorMessages.fetch)
          }
          return response.json()
        })
        .then((data) => {
          for (const key in data) {
            if (data[key].id === id) {
              fetch(`${API_URL}/${key}.json`, {
                method: 'DELETE'
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(taskErrorMessages.delete)
                  }
                  this.tasks = this.tasks.filter((task) => task.id !== id)
                })
                .catch((error) => {
                  alert(error)
                })
            }
          }
        })
        .catch((error) => {
          alert(error)
        })
    },
    toggleFav(id: number): void {
      const task = this.tasks.find((t) => t.id === id)
      if (task) {
        task.isFav = !task.isFav
        fetch(`${API_URL}.json`, {
          method: 'GET'
        })
          .then((res) => res.json())
          .then((data) => {
            for (const key in data) {
              if (data[key].id === id) {
                fetch(`${API_URL}/${key}.json`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    isFav: task.isFav
                  })
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error(taskErrorMessages.update)
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
      }
    }
  }
})
