import { ChatType } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    selectedChat: null,
  },
  reducers: {
    SetChats: (state, action) => {
      state.chats = action.payload;
    },
    SetSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { SetChats, SetSelectedChat } = chatSlice.actions;
export default chatSlice;

export interface ChatState {
  chats: ChatType[];
  selectedChat: ChatType | null;
}
