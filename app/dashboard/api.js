import axios from 'axios'

function getCookie(name) {
  const value = "; " + document.cookie
  const parts = value.split("; " + name + "=")
  if (parts.length == 2) return parts.pop().split(";").shift()
}

function parseLink(link) {
  if (!link) {
    return {}
  }

  const parts = link.split(',')
  let result = {}
  let re = /<(\S+)>;rel="(\w+)"/

  function params(search) {
    let param = search.slice(1)
    let params = {}
    param.split('&').map(function(item) {
      let keyValue = item.split('=')
      params[keyValue[0]] = keyValue[1]
    })
    return params
  }

  parts.map(function(item) {
    let match = item.match(re)
    let key = match[2]
    let url = match[1]

    let parser = document.createElement('a')
    parser.href = url;
    result[key] = {'params': params(parser.search), 'path': parser.pathname}
  })

  return result
}

const token = getCookie('token')
const request = axios.create({
  baseURL: '/api/',
  timeout: 1000,
  headers: {'Authorization': 'Bearer ' + token}
})

function fetchPosts() {
  return request.get('posts')
}

function fetchDrafts() {
  return request.get('posts?draft=true')
}

function createPost(data) {
  return request.post('posts', data)
}

export {
  fetchPosts,
  fetchDrafts,
  createPost,
  token,
  parseLink,
}
