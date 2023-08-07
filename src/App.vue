<template>
  <main>
    <!-- heading -->
    <header>
      <img src="./assets/pinia-seeklogo.com.svg" alt="pinia logo" />
      <h1>Pinia task manager</h1>
    </header>

    <!-- new task form -->
    <div class="new-task-form">
      <task-form></task-form>
    </div>

    <!-- filter -->
    <nav class="filter">
      <button @click="filter = 'all'">All tasks</button>
      <button @click="filter = 'favs'">Fav tasks</button>
    </nav>

    <!-- list -->
    <div v-if="taskStore.isLoading" class="task-list">Loading...</div>
    <div v-if="filter === 'all' && !taskStore.isLoading" class="task-list">
      <p>You have {{ taskStore.allCount }} tasks</p>
      <div v-for="task in taskStore.tasks" :key="task.id">
        <task-details :task="task"></task-details>
      </div>
    </div>
    <div v-else-if="filter === 'favs' && !taskStore.isLoading" class="task-list">
      <p>You have {{ taskStore.favCount }} fav tasks</p>
      <div v-for="task in taskStore.favs" :key="task.id">
        <task-details :task="task"></task-details>
      </div>
    </div>
  </main>
</template>

<script>
import TaskDetails from './components/TaskDetails.vue'
import TaskForm from './components/TaskForm.vue'

import { useTaskStore } from './stores/TaskStore'
import { ref } from 'vue'

export default {
  components: { TaskDetails, TaskForm },
  setup() {
    const taskStore = useTaskStore()

    const filter = ref('all')

    return { taskStore, filter }
  },
  mounted() {
    const taskStore = useTaskStore()
    taskStore.getTasks()
  }
}
</script>
