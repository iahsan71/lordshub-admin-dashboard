import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Timestamp } from 'firebase/firestore';

export interface Blog {
  id: string;
  title: string;
  description: string; // Rich text HTML content
  imageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface BlogsState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
}

const initialState: BlogsState = {
  blogs: [],
  loading: false,
  error: null,
};

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs: (state, action: PayloadAction<Blog[]>) => {
      state.blogs = action.payload;
    },
    addBlog: (state, action: PayloadAction<Blog>) => {
      state.blogs.unshift(action.payload);
    },
    updateBlog: (state, action: PayloadAction<Blog>) => {
      const index = state.blogs.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.blogs[index] = action.payload;
      }
    },
    deleteBlog: (state, action: PayloadAction<string>) => {
      state.blogs = state.blogs.filter(b => b.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  setLoading,
  setError,
} = blogsSlice.actions;

export default blogsSlice.reducer;
