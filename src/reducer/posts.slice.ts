import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import {addPost, deletePost, fetchPosts, updatePost} from './posts.extra'

export type Post = {
  id: string;
  name: string;
}

export enum LoadingType {
  idle,
  pending,
  succeeded,
  failed
}
const postsAdapter = createEntityAdapter<Post>({
    selectId: (post) => post.id,
    sortComparer: (a, b) => a.name.localeCompare(b.name),
})

export const postSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState({loading: LoadingType.idle}),
  reducers: {
    postAdd: postsAdapter.addOne,
    postUpdate: postsAdapter.updateOne,
    postDelete: postsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    // Get All
    builder.addCase(fetchPosts.pending, (state) => {
      state.loading = LoadingType.pending
    })

    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.loading = LoadingType.succeeded
      postsAdapter.setAll(state, action.payload)
    })
    
    // Add
    builder.addCase(addPost.pending, (state) => {
      state.loading = LoadingType.pending
    })
    
    builder.addCase(addPost.fulfilled, (state, action) => {
      state.loading = LoadingType.succeeded
      postsAdapter.addOne(state, action.payload)
    })

    // update
    builder.addCase(updatePost.pending, (state) => {
      state.loading = LoadingType.pending
    })
    
    builder.addCase(updatePost.fulfilled, (state, action) => {
      state.loading = LoadingType.succeeded
      postsAdapter.updateOne(state, {id: action.payload.id, changes: {name: action.payload.name}})
    })

    // Delete
    builder.addCase(deletePost.pending, (state) => {
      state.loading = LoadingType.pending
    })
    
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.loading = LoadingType.succeeded
      postsAdapter.removeOne(state,  action.payload.id)
    })
  }
})

export const { postAdd, postUpdate, postDelete } = postSlice.actions

const postsSelectors = postsAdapter.getSelectors<RootState>(
  (state) => state.posts
)

// Other code such as selectors can use the imported `RootState` type
export const selectCount = postsSelectors.selectTotal

export const getAllPosts = (state: RootState) => postsSelectors.selectAll(state)

export const getPostById = (id: string) => (state:RootState) => getAllPosts(state).find(post => post.id === id)

export default postSlice.reducer