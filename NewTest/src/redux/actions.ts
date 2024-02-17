type State = {
    name: string;
    ministry: string;
    uploadedFiles: File[];
  };
  
  type Action =
    | { type: 'SET_NAME'; payload: string }
    | { type: 'SET_MINISTRY'; payload: string }
    | { type: 'SET_UPLOADED_FILES'; payload: File[] };
  
  const initialState: State = {
    name: '',
    ministry: '',
    uploadedFiles: [],
  };
  
  function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
      case 'SET_NAME':
        return { ...state, name: action.payload };
      case 'SET_MINISTRY':
        return { ...state, ministry: action.payload };
      case 'SET_UPLOADED_FILES':
        return { ...state, uploadedFiles: action.payload };
      default:
        return state;
    }
  }
  
  export default reducer;