import { createSlice } from "@reduxjs/toolkit";
import servicesData from "../../app/data/services.json";
import { normalizeList } from "../../utils";

export interface serviceState {
    id: number,
    name: string,
    position: {
        lat: number,
        lng: number,
    }
}

export interface servicesState {
    list: {[key: number]: serviceState};
    history: Array<string>,
    popular: Array<string>,
    hits: {[key: string]: number},
    selected: number | null,
}

const initialState = {
    list: normalizeList(servicesData),
    history: [],
    popular: ['Massage', 'Salongens massage', 'Massör'],
    hits: {},
    selected: null
}

const servicesSlice = createSlice({
  name: 'servicesSlice',
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

    increaseHits: (state, action) => {
      let index = action.payload;
      let list: {[key: string]: number} = {...state.hits};
      list[index] = list[index] ? list[index] + 1 : 1;
      state.hits = list;
    }
  }
})

export const {setSelected, pushToHistory, removeFromHistory, increaseHits} = servicesSlice.actions
export default servicesSlice.reducer
