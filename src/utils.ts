import { locationState } from './redux/slices/locationsSlice';
import { serviceState } from './redux/slices/servicesSlice';

export function normalizeList (obj: Array<locationState|serviceState> ) {
    let list: {[key: number]: locationState|serviceState} = {};

    obj.forEach(row => {
        list[row.id] = row;
    });

    return list;
}