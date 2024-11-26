<template>
  <div class="app-container">
    <switch-roles @change="handleRolesChange" />
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="会议主题">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="选择会议室">
        <el-select v-model="form.region" placeholder="请选择可用会议室">
          <el-option label="会议室一" value="shanghai" />
          <el-option label="会议室二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="会议时间">
        <el-col :span="11">
          <el-date-picker v-model="form.date1" type="date" placeholder="日期" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="开始时间" style="width: 100%;" />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date3" type="fixed-time" placeholder="结束时间" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="生成会议记录">
        <el-switch v-model="form.delivery" />
      </el-form-item> -->
      <el-form-item label="与会人员">
        <el-select v-model="form.person" multiple placeholder="请选择与会人员">
          <el-option label="员工1" value="option1" />
          <el-option label="员工2" value="option2" />
          <el-option label="员工114" value="option3" />
        </el-select>
      </el-form-item>
      <el-form-item label="会议议题">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建会议</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        date3: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        person: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('已成功预约')
    },
    onCancel() {
      this.$message({
        message: '取消预约',
        type: 'warning'
      })
    },
    handleRolesChange() {
      this.$router.push({ path: '/example/index?' + +new Date() })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

