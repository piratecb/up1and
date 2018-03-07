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

function postArgument(count, p, type, draft) {
	let args = `limit=${count}&offset=${p ? p * count : 0}`
	if (type === 'page') {
		args = `type=${type}&` + args
	}
	if (draft === true) {
		args = `draft=true&` + args
	}
	return args
}

const Posts = {
  all: (page, limit=10, type='post', draft=false) =>
    requests.get(`/posts?${postArgument(limit, page, type, draft)}`),
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
//   Metas,
}