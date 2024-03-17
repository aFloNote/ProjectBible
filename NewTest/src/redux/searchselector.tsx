import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {SearchResult} from '@/types/sermon';



interface SearchState {
  results: SearchResult[];
  input: string;
}

const initialState: SearchState = {
  results: [],
  input:'',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchResults(state, action: PayloadAction<SearchResult[]>) {
      state.results = action.payload;
    },
	setSearch(state, action: PayloadAction<string>) {
		state.input = action.payload;
  },
},
});

export const { setSearchResults,setSearch } = searchSlice.actions;

export default searchSlice.reducer;