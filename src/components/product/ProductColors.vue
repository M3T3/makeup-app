<template>
    <ul class="product-colors">
        <li class="product-colors__list" v-for="color in colors" :key="color.name">
            <span class="product-colors__item" :style="{ backgroundColor: color.hex_value }"></span>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'product-colors',
    props: ['colors'],
    data() {
        return {

        }
    }
}
</script>

<style lang="scss">
.product-colors {
    list-style: none;
    padding: 0;
    margin: 0;

    &__list {
        display: inline-block;
    }

    &__item {
        margin-right: 0.3rem;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: block;
    }
}
</style>