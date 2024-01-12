<template>
    <div class="table-container">
      <table class="gantt-table">
        <thead>
          <tr>
            <th>Оборудование</th>
            <th v-for="time in times" :key="time">{{ time }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="operation in operations" :key="operation.name">
            <td>{{ operation.type_equipment }}</td>
            <td v-for="time in times" :key="time">
              <div v-if="time > operation.start_time && time <= operation.end_time" class="operation-bar">
                {{ operation.name }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      data: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        operationsData: []
      }
    },
    created() {
      let currentTime = 0;
      this.operationsData = this.data.map(operation => {
        operation.start_time = currentTime;
        operation.end_time = Number(currentTime) + Number(operation.time_for_operation.amount);
        currentTime = operation.end_time;
        if (operation.time_for_operation.units === 'часов' || operation.time_for_operation.units === 'ч' || operation.time_for_operation.units === 'час' || operation.time_for_operation.units === 'часа') {
            operation.end_time = Number(currentTime) + Number(operation.time_for_operation.amount)*60;
            currentTime = operation.end_time;
        }
        return operation;
      });
    },
    computed: {
      operations() {
        return this.operationsData;
      },
      times() {
        const maxTime = Math.max(...this.operations.map(op => op.end_time));
        let times = [];
        for (let i = 30; i <= maxTime; i += 30) {
          times.push(i);
        }
        return times;
      }
    }
  }
  </script>
  
  <style scoped>
  .table-container {
    max-width: 1400px;
    width: 100%;
    overflow-x: auto;
  }
  
  .gantt-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .gantt-table th, .gantt-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  
  .operation-bar {
    background-color: #f0f0f0;
    line-height: 16px;
  }
  </style>
  