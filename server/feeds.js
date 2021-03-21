const feeds = Object.fromEntries([
  feed('top', 'topstories', 10),
  feed('new', 'newstories', 12),
  feed('ask', 'askstories', 2),
  feed('show', 'showstories', 2),
  feed('jobs', 'jobstories', 1)
])

module.exports = { feeds }

function feed (label, source, pages) {
  return [label, { source, pages }]
}
