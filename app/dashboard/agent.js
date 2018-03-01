import axios from 'axios'

function getCookie(name) {
  const value = "; " + document.cookie
  const parts = value.split("; " + name + "=")
  if (parts.length == 2) return parts.pop().split(";").shift()
}

const token = getCookie('token')
const requests = axios.create({
  baseURL: '/api',
  timeout: 1000,
  headers: {'Authorization': 'Bearer ' + token}
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
    requests.del(`/posts/${id}`),
  get: id =>
    requests.get(`/posts/${id}`),
  update: (id, data) =>
    requests.put(`/posts/${post.id}`, data),
  create: (data) =>
    requests.post('/posts', data)
}


export default {
  Posts,
//   Profile,
//   Metas,
}