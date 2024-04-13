import { AuthorType, SeriesType, SermonType,TopicType,ScriptureType } from "@/types/sermon";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface SelectedState {
  selectedAuthor: AuthorType | null; // use Authors type
  selectedSeries: SeriesType | null; // replace with your Series type
  selectedSermon: SermonType | null; 
  selectedTopic: TopicType | null;
  selectedTopics: TopicType[] | null;
  selectedScripture: ScriptureType | null;
  selectedSermonPage:string;
}

const initialState: SelectedState = {
  selectedAuthor: null,
  selectedSeries: null,
  selectedSermon: null,
  selectedTopic: null,
  selectedTopics: null,
  selectedScripture: null,
  selectedSermonPage: "sermons",
};

const selectedSlice = createSlice({
  name: "selected",
  initialState,
  reducers: {
    setSelectedAuthor(state, action: PayloadAction<AuthorType | null>) {
      // replace with your Author type
      state.selectedAuthor = action.payload;
    },
    setSelectedSeries(state, action: PayloadAction<SeriesType | null>) {
      // replace with your Series type
      state.selectedSeries = action.payload;
    },
    setSelectedSermon(state, action: PayloadAction<SermonType | null>) {
      state.selectedSermon = action.payload;
    },
    setSelectedSermonPage(state, action: PayloadAction<string>) {
      state.selectedSermonPage = action.payload;
    },
    setSelectedTopic(state, action: PayloadAction<TopicType | null>) {
      state.selectedTopic = action.payload;
    },
    setSelectedScripture(state, action: PayloadAction<ScriptureType | null>) {
      state.selectedScripture = action.payload;
    },
	setSelectedTopics(state, action: PayloadAction<TopicType[] | null>) {
		state.selectedTopics = action.payload;
	},
  },
});

export const { setSelectedAuthor, setSelectedSeries, setSelectedSermon,setSelectedSermonPage,setSelectedTopic
,setSelectedScripture,setSelectedTopics } =
  selectedSlice.actions;

export default selectedSlice.reducer;
