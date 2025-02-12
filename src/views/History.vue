<template>
    <div class="container">
        <div class="history">
            <div class="top-block">
                <div class="left">
                    <img @click="goToCalculator" src="@/assets/arrow.svg" width="18" height="18" />
                    <p>История вычислений</p>
                </div>
                <div class="right">
                    <img @click="clearHistory" src="@/assets/clear.svg" width="20" height="20" />
                </div>
            </div>
            <div class="history-list">

                <div v-if="history.length === 0" class="empty">Еще нет вычислений</div>

                <!-- исправление. убрал index -->
                <HistoryItem
                    v-for="item in history"
                    :key="item.id"
                    :expression="item.expression"
                    :result="item.result"
                    :date="item.date"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { useCalculatorStore } from '@/stores/calc.js'
import axios from "axios";

export default {
    name: "HistoryView",
    components: {
        HistoryItem: defineAsyncComponent(() => import("@/components/HistoryItem.vue"))
    },
    created() {
        this.store = useCalculatorStore();
    },
    computed: {
        history() {
            return this.store.history;
        }
    },
    async mounted() {
        await this.store.fetchHistory();
    },
    methods: {
        async clearHistory() {
            try {
                await axios.delete('http://localhost:3000/history/expressions', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                await this.store.fetchHistory()
            } catch (error) {
                console.error('Ошибка:', error);
            }
        },
        goToCalculator() {
            this.$router.push('/calculator')
        }
    }
}
</script>

<style scoped>

.history {
    display: flex;
    flex-direction: column;
    width: 30%;
    background-color: transparent;
    border: 1px solid black;
    padding: 18px;
    border-radius: 20px;
}

.top-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.top-block .left {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
}

.top-block img {
    cursor: pointer;
}

.history-list {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.empty {
    text-align: center;
    color: #666;
}

@media (max-width: 768px) {
    .container {
        align-items: start;

    }

    .history {
        width: 100%;
        border: none;
        border-radius: 0px;
}
}
</style>
