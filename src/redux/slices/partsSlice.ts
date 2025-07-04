import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//import { request, gql } from 'graphql-request';
import axios from 'axios';

export const fetchParts = createAsyncThunk('parts/fetchParts', async () => {
  const response = await axios.get('/api/parts');
  return response.data;

  // const query = gql`
  //   query {
  //     parts {
  //       id
  //       name
  //       type
  //       code
  //     }
  //   }
  // `;
  // const data = await request('http://localhost:8000/graphql', query);
  // return data.parts;
});

interface Part {
  id: number;
  name: string;
  type: string;
  code: string;
}

interface PartsState {
  list: Part[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: PartsState = {
  list: [],
  status: 'idle',
};

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