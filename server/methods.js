const got = require('got')
const { values, assign } = Object
const all = promises => Promise.all(promises)
const { feeds } = require('./feeds')

const $fetch = got.extend({
  prefixUrl: 'https://hacker-news.firebaseio.com/v0/',
  responseType: 'json'
})

async function fetchFeed ({ feed, page }, req, reply) {
  const { body } = await $fetch(`${feeds[feed].source}.json`)
  const entries = values(body).slice(page * 10, page * 10 + 10)
  const items = await all(entries.map(async (id) => {
    const { json } = await this.api.client.fetchItem({ id })
    return json
  }))
  reply.type('application/json; charset=utf-8')
  reply.send({ items, ids: items.map(item => item.id) })
}

async function fetchItemWithComments ({ id }, req, reply) {
  return fetchItem.call(this, { id }, req, reply, true)
}

async function fetchItem ({ id }, req, reply, withComments = false) {
  const { body } = await $fetch(`item/${id}.json`)
  const item = assign({ kids: [] }, body)
  const comments = []

  if (withComments) {
    comments.push(...await all(
      item.kids.map(async (id) => {
        const { json } = await this.api.client.fetchItem({ id })
        return json
      })
    ))
  }

  reply.send({
    id: item.id,
    user: item.by,
    points: item.score,
    time: item.time,
    content: encodeUnsafe(item.text),
    url: item.url,
    type: item.type,
    title: encodeUnsafe(item.title),
    comments_count: values(item.kids).length,
    comments
  })
}

async function fetchUser ({ id }, _, reply) {
  const { body: user } = await $fetch(`user/${id}.json`)
  reply.send({
    id: user.id,
    karma: user.karma,
    created_time: user.created,
    about: user.about
  })
}

module.exports = {
  fetchFeed,
  fetchItem,
  fetchItemWithComments,
  fetchUser
}

function encodeUnsafe (str = '') {
  return str.replace(/[\u00A0-\u9999<>&]/g, (c) => {
    return `&#${c.charCodeAt(0).toString(16)};`
  })
}
