<template>
    <div class="container">
       <div @click="goToCalc" class="button">Перейти к калькулятору</div>
    </div>
</template>

<script>

export default {
    name: "MainView",
    methods: {
        goToCalc() {
            this.$router.push('/calculator')
        },
    },

}
</script>

<style scoped>

.container {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.button {
    width: fit-content;
    color: #fff;
    font-weight: 700;
    font-size: 18px;
    background-color: rgba(0, 0, 0, 1);
    padding: 15px;
    border-radius: 10px;
    cursor: pointer;
    transition: all ease-in 0.2s;
}

.button:hover {
    background-color: rgba(0, 0, 0, 0.8);
    filter: drop-shadow(0px 3px 10px #000000);
    padding: 17px;
}
</style>
