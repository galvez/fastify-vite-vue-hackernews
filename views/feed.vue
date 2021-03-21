<template>
  <div class="view">
    <Pagination v-if="feed" :feed="feed" :page="page" />
    <transition
      :name="transition"
      mode="out-in">
      <Suspense>
        <div v-if="feed" :key="page" class="news-list">
          <ul>
            <Item v-for="item in items" :key="item.id" :item="item" />
          </ul>
        </div>
      </Suspense>
    </transition>
    <Pagination v-if="feed" :feed="feed" :page="page" />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { useFeedPage } from '../logic/hooks'

const Pagination = defineAsyncComponent(() => import('../parts/pagination.vue'))
const Item = defineAsyncComponent(() => import('../parts/item.vue'))

export default {
  components: {
    Pagination,
    Item
  },
  async setup () {
    return { ...await useFeedPage() }
  }
}
</script>

<style lang="stylus">
.news-list {
  background-color: #fff;
  border-radius: 2px;
}

.news-list {
  margin: 10px 0;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
}

.slide-left-enter, .slide-right-leave-to {
  opacity: 0;
  transform: translate(30px, 0);
}

.slide-left-leave-to, .slide-right-enter {
  opacity: 0;
  transform: translate(-30px, 0);
}

.item-move, .item-enter-active, .item-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.item-enter {
  opacity: 0;
  transform: translate(30px, 0);
}

.item-leave-active {
  position: absolute;
  opacity: 0;
  transform: translate(30px, 0);
}

@media (max-width: 600px) {
  .news-list {
    margin: 10px 0;
  }
}
</style>
