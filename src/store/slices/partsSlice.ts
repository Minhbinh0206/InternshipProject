import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { request } from 'graphql-request';
import { GET_PARTS } from '../../graphQL/partQueries';

interface Version {
  id: number;
  name: string;
}

interface Revision {
  id: number;
  versions: Version[];
}

interface Part {
  id: number;
  revisions: Revision[];
}

interface PartsState {
  list: Part[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: PartsState = {
  list: [],
  status: 'idle',
};

export const fetchParts = createAsyncThunk<Part[]>('parts/fetchParts', async () => {
  const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT;
  const data = await request<{ parts: Part[] }>(endpoint, GET_PARTS);
  return data.parts;
});

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchParts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchParts.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchParts.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default partsSlice.reducer;
