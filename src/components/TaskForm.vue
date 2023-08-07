<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input type="text" placeholder="add your new task..." v-model="newTask" />
      <button>Add</button>
    </form>
  </div>
</template>

<script>
import { useTaskStore } from '../stores/TaskStore'
import { ref } from 'vue'

export default {
  setup() {
    const taskStore = useTaskStore()

    const newTask = ref('')

    const handleSubmit = () => {
      if (newTask.value.length > 0) {
        taskStore.addTask({
          id: Math.floor(Math.random() * 10000),
          title: newTask.value,
          isFav: false
        })
        newTask.value = ''
      }

      taskStore.getTasks()
    }
    return { handleSubmit, newTask }
  }
}
</script>
