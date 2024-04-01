import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {SearchResult} from '@/types/sermon';



interface SearchState {
  results: SearchResult[];
  input: string;
  datePressed: boolean;
}

const initialState: SearchState = {
  results: [],
  input:'',
  datePressed:false
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
  setDatePressed(state, action: PayloadAction<boolean>) {	
	state.datePressed = action.payload;
  },
},
});

export const { setSearchResults,setSearch,setDatePressed } = searchSlice.actions;

export default searchSlice.reducer;