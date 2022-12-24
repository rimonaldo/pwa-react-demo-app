import { httpService } from './http.service'
import { storageService } from './storage.service'

export const userService = {
   login,
   signup,
   logout,
   removeUser,
   updateUser,
   getLoggedinUser,
   getUsers,
   getById,
}

const STORAGE_KEY = 'user'

async function getUsers() {
   console.log('getting users')
   return await httpService.get('user')
}

async function getById(userId) {
   const user = await httpService.get(`user/${userId}`)
   return user
}

async function login(credential) {
   const user = await httpService.post('auth/login', credential)
   if (user) return _saveLocalUser(user)
}

async function signup(signupInfo) {
   console.log('signupInfo', signupInfo)
   const user = await httpService.post('auth/signup', signupInfo)
   return _saveLocalUser(user)
}

async function logout() {
   console.log('login out')
   sessionStorage.removeItem(STORAGE_KEY)
   return await httpService.post('auth/logout')
}

async function removeUser(userId) {
   return httpService.delete(`user/${userId}`)
}

async function updateUser(user) {
   user = await httpService.put(`user/${user._id}`, user)
   if (getLoggedinUser()._id === user._id) _saveLocalUser(user)
   return user
}

function getLoggedinUser() {
   return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null')
}

function _saveLocalUser(user) {
   sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
   return user
}
