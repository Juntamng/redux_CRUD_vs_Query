import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { Post } from './posts.slice'

export const fetchPosts = createAsyncThunk(
    'posts/getAll',
    async () => {
      const response = await axios.get("/posts")
      return response.data
    }
  )

export const addPost = createAsyncThunk(
    'posts/add',
    async (post: Pick<Post, "name">) => {
      const response = await axios.post("/posts", post)

      return response.data
    }
  )

export const updatePost = createAsyncThunk(
    'posts/update',
    async (post: Post) => {
      const response = await axios.put(`/posts/${post.id}`, post)

      return response.data
    }
  )


export const deletePost = createAsyncThunk(
    'posts/delete',
    async (id: string) => {
      const response = await axios.delete(`/posts/${id}`)

      return response.data
    }
  )
