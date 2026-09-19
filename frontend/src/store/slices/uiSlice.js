import { createSlice } from '@reduxjs/toolkit'

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isChatOpen: false,
    isDarkMode: true,
    sidebarOpen: false,
    notifications: [],
  },
  reducers: {
    toggleChat: (state) => { state.isChatOpen = !state.isChatOpen },
    setChat: (state, action) => { state.isChatOpen = action.payload },
    toggleDarkMode: (state) => { state.isDarkMode = !state.isDarkMode },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen },
    addNotification: (state, action) => { state.notifications.unshift(action.payload) },
    markRead: (state, action) => {
      const notif = state.notifications.find((n) => n.id === action.payload)
      if (notif) notif.read = true
    },
  },
})

export const { toggleChat, setChat, toggleDarkMode, toggleSidebar, addNotification, markRead } = uiSlice.actions
export default uiSlice.reducer
