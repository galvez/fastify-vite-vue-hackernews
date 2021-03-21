<template>
  <div class="user-view view">
    <Suspense>
      <div v-if="user.id">
        <h1>User: {{ user.id }}</h1>
        <ul class="meta">
          <li>
            <span class="label">Created:</span> {{ timeAgo(user.created_time) }} ago
          </li>
          <li>
            <span class="label">Karma:</span> {{ user.karma || '-' }}
          </li>
          <li
            v-if="user.about"
            class="about"
            v-html="user.about"
          />
        </ul>
        <p class="links">
          <a :href="'https://news.ycombinator.com/submitted?id=' + user.id">submissions</a> |
          <a :href="'https://news.ycombinator.com/threads?id=' + user.id">comments</a>
        </p>
      </div>
      <div v-else>
        <h1>User not found.</h1>
      </div>
    </Suspense>
  </div>
</template>

<script>
import { useRouteAndAPI } from '../logic/hooks'
import { timeAgo } from '../logic/filters'

export default {
  async setup () {
    const [route, api] = useRouteAndAPI()

    const id = route.params.id
    const { json: user } = await api.fetchUser({ id })

    return { user }
  },
  methods: { timeAgo }
}
</script>

<style lang="stylus">
.user-view {
  background-color: #fff;
  box-sizing: border-box;
  padding: 2em 3em;

  h1 {
    margin: 0;
    font-size: 1.5em;
  }

  .meta {
    list-style-type: none;
    padding: 0;
  }

  .label {
    display: inline-block;
    min-width: 4em;
  }

  .about {
    margin: 1em 0;
  }

  .links a {
    text-decoration: underline;
  }
}
</style>
