import { createSlice } from "@reduxjs/toolkit";
import locationData from "../../app/data/locations.json";
import { normalizeList } from "../../utils";

export interface locationState {
    id: number,
    name: string,
    position: {
        lat: number,
        lng: number,
    }
}

export interface locationsState {
    currentLocation: locationState,
    // list: Array<locationState>,
    list: {[key: number]: locationState};
    history: Array<number>,
    selected: number,
    popular: Array<number>, // quick fix
    hits: {[key: string]: number},
  }

const initialState = {
  currentLocation: {
    id: 1,
    name: 'My location',
    position: {
      lat: 59.3166428,
      lng: 18.0561182999999
    }
  },
  list: normalizeList(locationData),
  history: [],
  popular: ['Svensk', 'Harlig', 'LPG'],
  hits: {},
  selected: 1
}

const locationsSlice = createSlice({
  name: 'locationsSlice',
  initialState,
  reducers: {
    setSelected: (state, action) => {
      state.selected = action.payload;
    },

    pushToHistory: (state, action) => {
      let searches: any = state.history;
      searches.push(action.payload);
      searches = searches.filter((x: any, i: any, a: any) => a.indexOf(x) == i);
      state.history = searches.reverse().slice(0, 3);
    },

    removeFromHistory: (state, action) => {
      state.history.splice(action.payload, 1);
    },

    setCurrentLocation: (state, action) => {
      state.currentLocation = {...state.currentLocation, ...action.payload}
    }
  }
})

export const {setSelected, pushToHistory, removeFromHistory, setCurrentLocation} = locationsSlice.actions
export default locationsSlice.reducer
