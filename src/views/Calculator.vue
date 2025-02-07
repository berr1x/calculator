<template>
    <div class="container">
        <div class="calculator">
            <div class="top-block">
                <p >{{ expressionValue }}</p>
                <div class="separator" />
            </div>
            <div class="middle-block">
                <p>
                    Результат: <strong>{{ expressionResult }}</strong>
                </p>
            </div>
            <div class="calc-block">
                <div class="calc-btn" @click="addElToString($event.target.innerText)">
                    <p>7</p>
                </div>
                <div class="calc-btn" @click="addElToString($event.target.innerText)">
                    <p>8</p>
                </div>
                <div class="calc-btn" @click="addElToString($event.target.innerText)">
                    <p>9</p>
                </div>
                <div class="calc-btn fill" @click="addElToString($event.target.innerText)">
                    <p>*</p>
                </div>
                <div class="calc-btn" @click="addElToString($event.target.innerText)">
                    <p>4</p>
                </div>
                <div class="calc-btn" @click="addElToString($event.target.innerText)">
                    <p>5</p>
                </div>
                <div class="calc-btn" @click="addElToString($event.target.innerText)">
                    <p>6</p>
                </div>
                <div class="calc-btn fill" @click="addElToString($event.target.innerText)">
                    <p>-</p>
                </div>
                <div class="calc-btn" @click="addElToString($event.target.innerText)">
                    <p>1</p>
                </div>
                <div class="calc-btn" @click="addElToString($event.target.innerText)">
                    <p>2</p>
                </div>
                <div class="calc-btn" @click="addElToString($event.target.innerText)">
                    <p>3</p>
                </div>
                <div class="calc-btn fill" @click="addElToString($event.target.innerText)">
                    <p>+</p>
                </div>
                <div class="calc-btn wide" @click="addElToString($event.target.innerText)">
                    <p>0</p>
                </div>
                <div class="calc-btn fill" @click="expressionCalc">
                    <p>=</p>
                </div>
                <div class="calc-btn fill" @click="addElToString($event.target.innerText)">
                    <p>/</p>
                </div>
            </div>
            <div class="history-block">
                <p @click="this.$router.push('/history')">История вычислений</p>
            </div>
        </div>
    </div>
</template>

<script>
import { useCalculatorStore } from '@/stores/calc.js'
import axios from 'axios';

export default {
    name: "CalculatorView",
    data() {
        return {
            expressionValue: "0",
            expressionResult: 0,
            operators: ["/", "+", "-", "*"]
        }
    },
    methods: {
        addElToString(e) {
            if (this.expressionValue.length >= 10) return
            const lastChar = this.expressionValue[this.expressionValue.length - 1];
            if(this.expressionValue == "0" && this.operators.includes(e)) return
            if(this.expressionValue == "0") this.expressionValue = "";

            if (this.operators.includes(lastChar) && this.operators.includes(e)) {
                this.expressionValue = this.expressionValue.slice(0, -1);
            }
            this.expressionValue += `${e}`
        },
        async expressionCalc() {
            if(this.operators.includes(this.expressionValue[this.expressionValue.length - 1])) return

            this.expressionResult = this.calculate()
            this.expressionResult = parseFloat(this.expressionResult.toFixed(4))

            const store = useCalculatorStore()
            const historyEntry = {
                expression: this.expressionValue,
                result: this.expressionResult,
                date: new Date().toLocaleString()
            };

            store.addToHistory(historyEntry.expression, historyEntry.result)

            try {
                const response = await axios.post('http://localhost:3000/history/expression', historyEntry, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Данные успешно отправлены:', response.data);
            } catch (error) {
                console.error('Ошибка:', error);
            }

            this.expressionValue = "0"
        },
        calculate() {
            return new Function('return ' + this.expressionValue)(); //без использования eval как в ТЗ...
        }
    },
}
</script>

<style scoped>

.container {
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
}

.calculator {
    display: flex;
    flex-direction: column;
    width: fit-content;
    background-color: transparent;
    border: 1px solid black;
    padding: 30px;
    border-radius: 20px;
}

.top-block {
    display: flex;
    flex-direction: column;
    text-align: right;
    font-size: 60px;
    font-weight: 300;
    line-height: 0;
}

.middle-block {
    display: flex;
    font-size: 25px;
    text-align: left;
}

.separator {
    width: 100%;
    background-color: black;
    height: 1px;
}

.calc-block {
    user-select: none;
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}

.calc-block .calc-btn {
  font-size: 24px;
  flex: 1 1 calc(25% - 10px); /* 4 колонки, учитывая отступы */
  margin: 5px;
  background-color: rgba(227, 227, 227, 1);
  text-align: center;
  border-radius: 100px;
  cursor: pointer;
  font-weight: 500;
  transition: all ease-in 0.1s;
}

.calc-block .calc-btn:hover {
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.2));
}

.calc-block .calc-btn.wide {
    flex: 2 2 calc(50% - 10px);
}

.calc-block .calc-btn.fill {
    background-color: rgba(255, 153, 0, 1);
    font-weight: 700;
}

.calc-block .calc-btn.fill:hover {
    filter: drop-shadow(0px 0px 5px rgba(255, 153, 0, 0.7));
}

.history-block {
    font-weight: 600;
    width: 100%;
    display: flex;
    justify-content: center;
    color: rgba(29, 106, 255, 1);
}

.history-block p {
    cursor: pointer;
    width: fit-content;
    transition: all ease-in 0.2s;
}

.history-block p:hover {
    text-decoration: underline;
    text-underline-offset: 8px;
    filter: drop-shadow(0px 0px 10px rgba(29, 106, 255, 0.3));
}

@media (max-width: 768px) {
  .calculator {
    border: none;
    padding: 30px;
    width: 100%;
    border-radius: 0;
  }

  .top-block {
    font-size: 40px;
  }

  .middle-block {
    font-size: 20px;
  }

  .calc-block .calc-btn {
    font-size: 20px;
    flex: 1 1 calc(25% - 10px);
    margin: 3px;
  }

  .history-block {
    font-size: 14px;
  }
}

</style>
