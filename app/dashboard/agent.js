import axios from 'axios'

function getCookie(name) {
  const value = "; " + document.cookie
  const parts = value.split("; " + name + "=")
  if (parts.length == 2) return parts.pop().split(";").shift()
}

const session = getCookie('jwt')
const requests = axios.create({
  baseURL: '/api',
  timeout: 1000,
  headers: {'Authorization': 'Bearer ' + session}
})

function postArgument(count, p, draft) {
  let text = `limit=${count}&offset=${p ? p * count : 0}`
  text = draft ? `draft=true&` + text : text
  return text
}

const Posts = {
  all: (page, limit=10, draft=false) =>
    requests.get(`/posts?${postArgument(limit, page, draft)}`),
  byAuthor: (username, page, limit=5) =>
    requests.get(`/posts/author/${username}?${postArgument(limit, page)}`),
  byMeta: (meta, page, limit=10) =>
    requests.get(`/posts/meta/${meta}?${postArgument(limit, page)}`),
  destory: id =>
    requests.delete(`/posts/${id}`),
  get: id =>
    requests.get(`/posts/${id}`),
  update: (id, data) =>
    requests.put(`/posts/${id}`, data),
  create: (data) =>
    requests.post('/posts', data)
}

const Pages = {
  all: () =>
    requests.get(`/pages`),
  destory: id =>
    requests.delete(`/pages/${id}`),
  get: id =>
    requests.get(`/pages/${id}`),
  update: (id, data) =>
    requests.put(`/pages/${id}`, data),
  create: (data) =>
    requests.post('/pages', data)
}

const Metas = {
  all: () =>
    requests.get(`/metas`),
  destory: id =>
    requests.delete(`/metas/${id}`),
  get: id =>
    requests.get(`/metas/${id}`),
  update: (id, data) =>
    requests.put(`/metas/${id}`, data),
  create: (data) =>
    requests.post('/metas', data)
}


export default {
  Posts,
  Metas,
  Pages,
}