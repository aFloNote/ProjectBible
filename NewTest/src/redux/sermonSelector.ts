import { AuthorsType, SeriesType, SermonType} from '@/types/sermon';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface SelectedState {
    selectedAuthor: AuthorsType | null; // use Authors type
    selectedSeries: SeriesType | null; // replace with your Series type
    selectedSermonPage:string;
    selectedSermon: SermonType | null;
  }

const initialState: SelectedState = {
  selectedAuthor: null,
  selectedSeries: null,
  selectedSermon:null,
  selectedSermonPage:"recent"
};

const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    setSelectedAuthor(state, action: PayloadAction<AuthorsType| null>) { // replace with your Author type
      state.selectedAuthor = action.payload;
    },
    setSelectedSeries(state, action: PayloadAction<SeriesType| null>) { // replace with your Series type
      state.selectedSeries = action.payload;
    },
    setSelectedSermonPage(state, action: PayloadAction<string>) {
      state.selectedSermonPage = action.payload;
    },
    setSelectedSermon(state, action: PayloadAction<SermonType| null>) {
      state.selectedSermon = action.payload;
    }

  },
});

export const { setSelectedAuthor, setSelectedSeries,setSelectedSermonPage, setSelectedSermon } = selectedSlice.actions;

export default selectedSlice.reducer;