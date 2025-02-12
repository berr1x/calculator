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
            <!-- вот наверное более правильная передача данных в функцию и более короткая запись... -->
            <div class="calc-block">
                <div
                    v-for="btn in buttons"
                    :key="btn"
                    class="calc-btn"
                    :class="{ wide: btn === '0', fill: ['/', '*', '-', '+', '='].includes(btn) }"
                    @click="btn === '=' ? expressionCalc() : addElToString(btn)"
                >
                    <p>{{ btn }}</p>
                </div>
            </div>
            <div class="history-block">
                <router-link style="text-decoration: none;" to="/history">
                    <p>История вычислений</p>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "CalculatorView",
    data() {
        return {
            expressionValue: "0",
            expressionResult: 0,
            operators: ["/", "+", "-", "*"],
            buttons: ['7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '=', '/']
        }
    },
    methods: {
        addElToString(e) {
            if (this.expressionValue.length >= 10) return
            const lastChar = this.expressionValue[this.expressionValue.length - 1];
            if(this.expressionValue === "0" && this.operators.includes(e)) return
            if(this.expressionValue === "0") this.expressionValue = "";

            if (this.operators.includes(lastChar) && this.operators.includes(e)) {
                this.expressionValue = this.expressionValue.slice(0, -1);
            }
            this.expressionValue += `${e}`
        },
        async expressionCalc() {
            if(this.operators.includes(this.expressionValue[this.expressionValue.length - 1])) return

            this.expressionResult = this.calculate()
            if (this.expressionResult === "Ошибка") {
                return
            }

            this.expressionResult = parseFloat(this.expressionResult.toFixed(4))

            const historyEntry = {
                expression: this.expressionValue,
                result: this.expressionResult,
            };

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
            //описание каждого действия калькулятора и проверка на порядок действий...

            const tokens = this.expressionValue.match(/(\d+)|([+\-*/])/g) || [];

            const numbers = [];
            const operators = [];

            //приоритет для операторов
            const precedence = {
                '+': 1,
                '-': 1,
                '*': 2,
                '/': 2,
            };

            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];

                if (/\d+/.test(token)) {
                    numbers.push(parseFloat(token));
                } else if (['+', '-', '*', '/'].includes(token)) {
                    while (
                        operators.length > 0 &&
                        precedence[operators[operators.length - 1]] >= precedence[token]
                    ) {
                        this.applyOperation(numbers, operators.pop());
                    }
                    operators.push(token);
                }
            }

            while (operators.length > 0) {
                this.applyOperation(numbers, operators.pop());
            }

            if (numbers.length === 1) {
                return numbers[0];
            } else {
                return 'Ошибка';
            }
        },
        //добавил отдельный метод для выполнения операций...
        applyOperation(numbers, operator) {
            const b = numbers.pop();
            const a = numbers.pop();

            switch (operator) {
                case '+':
                    numbers.push(a + b);
                    break;
                case '-':
                    numbers.push(a - b);
                    break;
                case '*':
                    numbers.push(a * b);
                    break;
                case '/':
                    if (b === 0) {
                        numbers.push('Ошибка'); // добавил проверку деления на ноль, которой не было до этого
                    } else {
                        numbers.push(a / b);
                    }
                    break;
                default:
                    numbers.push('Ошибка');
            }
        }
    },
}
</script>

<style scoped>

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
