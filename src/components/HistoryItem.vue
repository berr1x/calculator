<template>
    <div class="history-item">
      <div class="history-item-left">
        <p>{{ expression }} = <span>{{ result }}</span></p>
      </div>
      <div class="history-item-right">
        <p>{{ formatDate(date) }}</p>
      </div>
    </div>
  </template>

  <script>
  export default {
    name: "HistoryItem",
    props: {
      expression: {
        type: String,
        required: true,
      },
      result: {
        type: Number,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
      },
    },
  };
  </script>

  <style scoped>
  .history-item {
    display: flex;
    width: 100%;
    line-height: 15px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid lightgray;
    padding: 10px 0;
  }

  .history-item-left {
    font-size: 20px;
  }

  .history-item-left p span {
    color: orange;
  }

  .history-item-right {
    color: rgba(146, 133, 133, 1);
    font-size: 14px;
  }
  </style>
