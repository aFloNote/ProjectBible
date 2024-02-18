import { AuthorsType, SeriesType} from '@/types/sermon';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface SelectedState {
    selectedAuthor: AuthorsType[] | null; // use Authors type
    selectedSeries: SeriesType[] | null; // replace with your Series type
  }

const initialState: SelectedState = {
  selectedAuthor: null,
  selectedSeries: null,
};

const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    setSelectedAuthor(state, action: PayloadAction<AuthorsType[]>) { // replace with your Author type
      state.selectedAuthor = action.payload;
    },
    setSelectedSeries(state, action: PayloadAction<SeriesType[]>) { // replace with your Series type
      state.selectedSeries = action.payload;
    },
  },
});

export const { setSelectedAuthor, setSelectedSeries } = selectedSlice.actions;

export default selectedSlice.reducer;