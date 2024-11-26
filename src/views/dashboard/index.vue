<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
import editorDashboard from './editor'
import testDashboard from './Test'

export default {
  name: 'Dashboard',
  components: { testDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'testDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
