import { defineStore } from 'pinia';
import axios from 'axios';

export const useCalculatorStore = defineStore('calculator', {
    state: () => ({
        history: []
    }),
    actions: {
        addToHistory(expression, result) {
            this.history.push({
                id: Date.now(),
                expression,
                result,
                date: new Date().toLocaleString() // Текущая дата и время
            });
        },

        async fetchHistory() {
            try {
              const response = await axios.get('http://localhost:3000/history/expressions');
              this.history = response.data;
            } catch (error) {
              console.error('Ошибка при загрузке истории:', error);
            }
          },
    }
});
