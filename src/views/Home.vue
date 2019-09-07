<template>
  <div class="home">
    <div class="loading" v-if="loading">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="d-flex flex-column align-items-center justify-content-center loading-screen">
              <img src="../assets/loading.svg" alt="Loading Icon" class="loading-icon">
              <p class="loading-text">Please wait while we are loading everything on your app..</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-3">
          <div>
            <p class="filters-title d-flex justify-content-between align-items-center" @click="showTags = !showTags">
              <span>
                Tags List
              </span>
              <svg width="20px" v-bind:class="{ 'rotate': showTags }" viewBox="0 0 129 129" enable-background="new 0 0 129 129">
                  <g>
                    <path d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z"/>
                  </g>
              </svg>
            </p>
            <transition name="slide">
              <ul class="filters filters-menu" v-if="showTags">
                <li class="menu-item filters-menu__item" v-for="tag in tags" :key="tag" v-bind:class="{ 'active': filterTag == tag }" @click="filterItems(tag)">
                  <p class="menu-item__link">{{ tag }}</p>
                </li>
                <li class="menu-item filters-menu__item" @click="filterTag = '' && showTags == false">
                  <p class="menu-item__link">Clear Filters</p>
                </li>
              </ul>
            </transition>
          </div>
        </div>
        <div class="col-12 col-md-9">
          <div v-if="!loading">
            <div v-if="filterTag == ''">
              <div v-for="product in displayedProducts" :key="product.id">
                 <product-card @clickedItem="clickedItem" :product="product"></product-card>      
              </div>
            </div>
            <div v-if="filterTag != ''">
              <div v-for="product in filterProductsByTags" :key="product.id">
                  <product-card @clickedItem="clickedItem" :product="product"></product-card>
              </div>
            </div>
            <ul v-if="filterTag == ''" class="pagination pagination-list d-flex justify-content-center">
              <li class="pagination-list__item" v-if="page != 1" @click="page--">
                <a class="pagination-list__link" href="#">&lt;</a>
              </li>
              <li class="pagination-list__item" v-bind:class="{ 'active': page == pageNumber }" v-for="pageNumber in pages.slice(page-1, page+5)" :key="pageNumber.page" @click="page = pageNumber">
                <a class="pagination-list__link" href="#">{{pageNumber}}</a>
              </li>
              <li class="pagination-list__item" v-if="page < pages.length" @click="page++">
                <a class="pagination-list__link" href="#">&gt;</a>
              </li>
            </ul> 
          </div>
          <transition name="modal">
            <div class="modal modal-mask" v-bind:class="{ 'show-modal': showModal === true }">
              <div class="container">
                <div class="row">
                  <div class="col-12 col-lg-10 offset-lg-1">
                    <div class="modal-wrapper">
                      <div class="modal-container">
                        <div class="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                          <p class="modal-name">{{modalProductName}}</p>
                          <img :src="modalProductImage" class="modal-image">
                        </div>
                        <button class="modal-btn" @click="showModal = false">
                            x
                        </button>  
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ProductCard from '@/components/product/ProductCard.vue'

export default {
  name: 'home',
  data() {
    return {
      loading: false,
      productList: [],
      filterItem: '',
      errors: '',
      page: 1,
      perPage: 50,
      pages: [],
      tags: [],
      allTags: [],
      finalTags: [],
      filterTag: '',
      showModal: false,
      showTags: false,
      modalProductName: '',
      modalProductImage: ''
    }
  },
  created() {
    this.loading = true,
    this.getProductsList();
  },
  methods: {
    getProductsList() {
        axios.get('http://makeup-api.herokuapp.com/api/v1/products.json')
        .then(response => {
          this.productList = response.data
          for (let i = 0; i < this.productList.length; i++) {
            let rating = (this.productList[i].rating) * 10;
            Object.assign(this.productList[i], {converted_rating: rating});
          }

          /* SORT PRODUCTS BY RATING */ 
          this.productList.sort(function(a, b) {
            return a.converted_rating - b.converted_rating;
          });
          /* END SORT PRODUCTS BY RATING */ 
          
          /* PAGINATE ITEMS AFTER RECEVING THEM */ 
          let numberOfPages = Math.ceil(this.productList.length / this.perPage);
          for (let i = 1; i <= numberOfPages; i++) {
            this.pages.push(i);
          }
          /* END PAGINATION */

          /* CREATE TAGS LIST */ 
          for (let i = 0; i < this.productList.length; i++) {
            this.allTags.push(this.productList[i].tag_list);
          }
          for (let e = 0; e < this.allTags.length; e++) {
            this.allTags[e].forEach(element => {
              this.finalTags.push(element);
            });
          }

          this.tags = Array.from(new Set(this.finalTags)).sort();
          /* END CREATE TAGS LIST */
          
          /* RECEIVE LOCALSTORAGE SELECTED TAG */
          if (localStorage.selectedTag) {
            this.filterTag = localStorage.selectedTag;
          }
          /* END RECEIVE LOCALSTORAGE SELECTED TAG */
          this.loading = false;
        })
        .catch(error => {
          this.errors = error.data
        })
    },
    paginate(products) {
      let page = this.page;
      let perPage = this.perPage;
      let from = (page * perPage) - perPage;
      let to = (page * perPage);
      return products.slice(from, to);
    },
    filterItems(text) {
      this.filterTag = text;
      localStorage.setItem('selectedTag', this.filterTag) ;
    },
    clickedItem(product) {
      this.modalProductName = product.name;
      this.modalProductImage = product.image_link;
      this.showModal = true;
    }
  },
  computed: {
    displayedProducts() {
      return this.paginate(this.productList);
    },
    filterProductsByTags() {
      return this.productList.filter(product => {
        return product.tag_list.includes(this.filterTag);
      });
    },
  },
  components: {
    ProductCard
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/mixins.scss';
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $white;
    z-index: 1;

    &-screen {
      margin-top: 25%;
    }

    &-icon {
      width: 50%;
    }
  }

.home {
  position: relative;
}

.rotate {
  transform: rotate(180deg);
}

.filters-menu {
  list-style: none;
  margin: 0 0 1rem 0;
  padding: 0;

  &__item {
    width: 100%;
    @include transition;
  }
}

.active {
  & .menu-item__link {
    color: $blue;
    background: $white;
    text-decoration: none;
  }
}


.menu-item__link {
  padding: 0.5rem 1rem;
  font-size: 1rem;;
  font-weight: 300;
  color: $menu-black;
  background: $bg;
  border-bottom: 1px solid $menu-border;
  text-decoration: none;
  margin-bottom: 0;
  cursor: pointer;
  text-transform: capitalize;
  @include transition;

  &:hover {
    text-decoration: none;
    background: $white;
  }
}

.filters-title {
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
}

.modal {
  &-mask {
    display: none;
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    @include transition;
  }

  &-wrapper {
    position: relative;
    width: 100%;
    background: $white;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba($black, .33);
    @include transition;
    padding: 2rem;
    margin-top: 10%;
  }

  &-name {
    text-align: center;
    font-size: 1rem;
  }

  &-image {
    width: 20%;
  }

  &-btn {
    width: 30px;
    height: 30px;
    position: absolute;
    right: -15px;
    top: -15px;
    background: $black;
    color: $white;
    border-radius: 50%;
    border: 1px solid $black;

    &:focus {
      outline: none;
    }
  }
}

.show-modal {
  display: block;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.slide-enter-active {
   @include transition;
}

.slide-leave-active {
   -moz-transition-duration: 0.3s;
   -webkit-transition-duration: 0.3s;
   -o-transition-duration: 0.3s;
   transition-duration: 0.3s;
   -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to, .slide-leave {
   max-height: 100px;
   overflow: hidden;
}

.slide-enter, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
}

.pagination {
  &-list__link {
    padding: 0.5rem 1rem;
    color: $blue;
    @include transition; 

    &:hover {
      text-decoration: none;
      color: $white;
      background: $blue;
    }
  }
}

.active .pagination-list__link {
  color: $white;
  background: $blue;
}

@media (min-width: 992px) {
  .menu-item__link {
    font-size: 1rem;
  }

  .filters-title {
    font-size: 2rem;
  }

  .modal {
    &-name {
      font-size: 1.5rem;
    }
  }
}

</style>
