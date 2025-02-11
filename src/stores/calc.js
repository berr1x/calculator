import { defineStore } from 'pinia';
import axios from 'axios';

export const useCalculatorStore = defineStore('calculator', {
    state: () => ({
        history: []
    }),
    actions: {
        async fetchHistory() {
            try {
              const response = await axios.get('http://192.168.0.24:3000/history/expressions');
              this.history = response.data;
            } catch (error) {
              console.error('Ошибка при загрузке истории:', error);
            }
          },
    }
});
