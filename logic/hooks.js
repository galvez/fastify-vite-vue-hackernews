import { ref, computed, reactive, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useServerAPI, useServerData } from 'fastify-vite/hooks'

export const state = reactive({
  feeds: {},
  items: {},
  users: {}
})

export function useRouteAndAPI () {
  return [useRoute(), useServerAPI()]
}

async function updateFeedPage (api, feed, page) {
  const { items, ids } = await useServerData(async () => {
    const { json } = await api.fetchFeed({ feed, page })
    return json
  })

  if (!state.feeds[feed]) {
    state.feeds[feed] = {}
  }

  state.feeds[feed][page] = ids

  for (const item of items) {
    state.items[item.id] = item
  }
}

export async function useFeedPage () {
  const [route, api] = useRouteAndAPI()

  const previousFeed = ref(null)
  const previousPage = ref(null)
  const transition = ref('slide-right')

  const feed = computed(() => route.params.feed)
  const page = computed(() => Number(route.params.page || 1))

  await updateFeedPage(api, feed.value, page.value)

  if (!import.meta.env.SSR) {
    watchEffect(async () => {
      if (!feed.value) {
        return
      }
      if (previousFeed.value && previousFeed.value !== feed.value) {
        updateFeedPage(api, feed.value, page.value)
      }
      if (page.value > (previousPage.value || -1)) {
        transition.value = 'slide-left'
        updateFeedPage(api, feed.value, page.value + 1)
      } else {
        transition.value = 'slide-right'
        if ((page.value - 1) > 0) {
          updateFeedPage(api, feed.value, page.value - 1)
        }
      }
      previousPage.value = page.value
      previousFeed.value = feed.value
    })

    previousPage.value = page.value
  }

  return {
    transition,
    items: computed(() => state.feeds[feed.value]?.[page.value]?.map(id => state.items[id])),
    feed,
    page
  }
}

export async function useFeedItem () {
  const [route, api] = useRouteAndAPI()

  const id = route.params.id
  const { json: item } = await useServerData(() => api.fetchItemWithComments({ id }))

  state.items[item.id] = item

  return {
    item: computed(() => state.items[id])
  }
}
