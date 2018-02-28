import axios from 'axios'

function getCookie(name) {
  const value = "; " + document.cookie
  const parts = value.split("; " + name + "=")
  if (parts.length == 2) return parts.pop().split(";").shift()
}

const token = getCookie('token')
const agent = axios.create({
  baseURL: '/api/',
  timeout: 1000,
  headers: {'Authorization': 'Bearer ' + token}
})

export default agent