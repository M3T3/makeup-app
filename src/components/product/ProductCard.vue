<template>
    <div class="product product-card d-flex flex-column flex-lg-row align-items-lg-center">
        <div class="flex-1 d-flex align-items-center justify-content-center">
            <img class="product-image" :src="product.image_link" :alt="product.name" @click="modalClicked(product)">
        </div>
        <div class="d-flex flex-column flex-2">
            <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-center product-info__text">
                <p class="product-info__title flex-2"> {{product.name}}</p>
                <p class="product-info__price flex-1 d-flex justify-content-end"> {{product.price}} $</p>
            </div>
            <div class="d-flex flex-column">
                <span class="available-colors" v-if="product.product_colors != ''">Available Colors</span>
                <span class="available-colors" v-else>No colors available</span>
                <product-colors :colors="product.product_colors"></product-colors>
            </div>
            <div class="product-rating d-flex align-items-center">
                <p class="product-rating__label">Rating</p>
                <p class="product-rating__number">{{product.converted_rating}} </p>
            </div>
            <router-link title="Product page" :to="{ name: 'product-page', params: { id: product.id }}" class="product-link" tag="a">View Details</router-link>
        </div>
    </div>  
</template>

<script>
import ProductColors from '@/components/product/ProductColors.vue'

export default {
    name: 'product-card',
    props: ['product'],
    data() {
        return {
        }
    },
    methods: {
        modalClicked (product) {
            this.$emit('clickedItem', product);
        }
    },
    components: {
        ProductColors
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/mixins.scss';

.flex-1 {
    flex: 1;
}

.flex-2 {
    flex: 2; 
}

.product {
    margin-bottom: 5%;

    &-card {
        @include transition;
        box-shadow: 0 2px 3px 0 $grey, 0 0 3px 0 $grey;
        background: $white;
        width: 100%;
        padding: 0.5rem;
        border-radius: 5px;

        &:hover {
            box-shadow: 0 0 15px 0 rgba(0,47,67,.25);
        }
    }

    &-image {
        max-width: 200px;
        max-height: 200px;
        cursor: pointer;
    }

    &-info__text {
        width: 100%;
        margin-bottom: 0.5rem;
    }

    &-info__title {
        font-size: 1rem;
        color: $blue;
        font-weight: 600;
        margin: 0;
    }

    &-info__price {
        color: $black;
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 0;
    }

    &-rating {
        margin-bottom: .5rem;

        &__label {
            color: $black;
            font-size: 0.9rem;
            margin: 0;
        }

        &__number {
            margin: 0 0 0 0.5rem;
            font-size: 1.2rem;
            font-weight: 600;
            color: $black;
        }
    }

    &-link {
        padding: .5rem;
        border-radius: 5px;
        background: $blue;
        border: 1px solid $blue;
        color: $white;
        max-width: 30%;
        text-align: center;
        @include transition;

        &:hover {
            background: $white;
            color: $blue;
            text-decoration: none;
        }
    }
}

.available-colors {
    color: $black;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

@media (min-width: 992px) {
    .product {
        &-image {
            margin-right: 10%;
        }
    }
}
</style>