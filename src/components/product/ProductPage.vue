<template>
    <div class="product-page">
        <div class="container">
            <div class="row">
                <div class="col-12 col-lg-6">
                    <img class="product-page__image" :src="product.image_link" :alt="product.name">
                </div>
                <div class="col-12 col-lg-6">
                    <div>
                        <p class="product-page__name">{{product.name}}</p>
                        <p class="product-page__price">Price: <span>{{product.price}} {{product.price_sign}}</span></p>
                        <p class="product-page__brand">{{product.brand}} - {{product.category}}</p>
                        <div>
                            <p class="product-page__colors">Product Colors</p>
                            <product-colors :colors="product.product_colors"></product-colors>
                        </div>
                        <a class="product-page__link" target="_blank" :href="product.product_link">Link to Product Page</a>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import axios from 'axios'
import ProductColors from '@/components/product/ProductColors.vue'

export default {
    name: 'product-page',
    props: ['id'],
    data() {
        return {
            product: {},
            errors: ''
        }
    },
    methods: {
        getProductInfo() {
            axios.get("http://makeup-api.herokuapp.com/api/v1/products/" + this.id + ".json")
                .then(response => {
                    this.product = response.data
                })
                .catch(error => {
                    this.errors = error.data
                })
        }
    },
    created() {
        this.getProductInfo()
    },
    components: {
        ProductColors
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/mixins.scss';
.product-page {
    &__image {
        width: 100%;
        margin-bottom: 2rem;
    }

    &__name {
        font-size: 1rem;
        color: $blue;
        font-weight: 500;
        font-style: italic;
    }

    &__price {
        font-size: 1rem;
        color: $black;

        span {
            font-size: 1.5rem;
        }
    }

    &__brand {
        font-style: italic;
        font-size: 1rem;
        color: $black;
        margin-right: 0.2rem;
    }

    &__colors {
        margin-bottom: 0.5rem;
    }

    &__link {
        margin-top: 1rem;
        color: $blue;
        display: block;
        

        &:hover {
            font-weight: bold;
            text-decoration: none;
        }
    }
}

@media (min-width: 992px) {
    .product-page {
        &__name {
            font-size: 1.5rem;
        }

        &__price {
            span {
                font-size: 2rem;
            }
        }
    }
}
</style>