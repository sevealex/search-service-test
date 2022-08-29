import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react';

import {increaseHits, pushToHistory, removeFromHistory} from '../../../redux/slices/servicesSlice';
import {inputFocus} from '../../../redux/slices/inputFocusSlice';
import {pushToHistory as locationPushToHistory, removeFromHistory as locationRemoveFromHistory, setCurrentLocation} from '../../../redux/slices/locationsSlice';


import './style.css'
import trash from '../../../trash.svg';
import {AppState} from '../../../redux/store';
import Search from '../../../services/search';

function SearchInput({
    typeList,
    placeholder
}:{
    typeList: 'services' | 'locations'
    placeholder: string,
}) {
    
    const [q, setQ] = useState();
    const [results, setRes] = useState({
        totalHits: 0,
        totalDocuments: 0,
        results: []
    });

    const handleClick = (event: any) => {
        console.log('input click', typeList == 'services' ? 1 : 2);
        dispatch(inputFocus(typeList == 'services' ? 1 : 2));
    }
    const handleBlur = (event: any) => {
        var container = document.getElementById(typeList);

        if (container && container !== event.target && !container.contains(event.target)) {    
            dispatch(inputFocus(0));
        }
    }
    const handleClickInBox = (event: any) => {
        dispatch(inputFocus(1));
    }

    const dispatch = useDispatch();

    const qTyping = (event: any) => {
        setQ(event.target.value);
        onSearchApply(event.target.value);
    }
    const onSearchApply = async (q: string): Promise<void> => {
        if(q.length == 0)
        {
            setRes({
                totalHits: 0,
                totalDocuments: 0,
                results: []
            });
        }
        else
        {
            let results: any;
            if(typeList == 'services')
            {
                results = await Search.query(q);
            }
            else {
                results = await Search.queryLocations(q);
            }

            console.log('RESULTS:', results);
            setRes(results);
        }
    }

    const selectItem = (query: any) => {
        setQ(query);
        onSearchApply(query);
    }
    const selectResult = (item: any) => {
        if(typeList == 'services')
        {
            dispatch(increaseHits(item.id));
            dispatch(pushToHistory(q));
        }
        else
        {
            dispatch(locationPushToHistory(q));
            dispatch(setCurrentLocation(item));
            setQ(item.name);
            dispatch(inputFocus(0));
            document.getElementById('input_services')?.focus();
        }
        
    }
    const deleteHistory = (index: number) => {
        if(typeList == 'services')
        {
            dispatch(removeFromHistory(index));
        }
        else
        {
            dispatch(locationRemoveFromHistory(index));
        }
    }

    const list = useSelector((state: AppState) => (typeList == 'services' ? state.services : state.locations));
    const listOpen = useSelector((state: AppState) => state.inputFocus.inputFocus);

    const history = list.history;
    const popular = list.popular;

    const details = (id: number) => {
        return list.list[id];
    }
    
    const renderList = (list: any, remove: boolean) => {
        const items = list.map((query: string, index: number) => {
            return (
                <li key={index} className="flex">
                    {
                        remove && (
                            <span onClick={(e) => deleteHistory(index)} className="deleteItem"><img src={trash} width="14" height="14" className="" alt="logo" /></span>
                        )
                    }
                    <span className="query" onClick={(e) => selectItem(query)}>{query}</span>
                </li>  
            )
        });

        return (
            <ul className="list">
                {items}
            </ul>
        )
    }

    const renderResults = (items: any) => {
        return (
            <ul className="list">
                {
                    items.map((row: any, index: number) => {
                        console.log(row);
                        return (
                            <li onClick={(e) => selectResult(row)} key={index} className="flex">
                                <span>{row.name}, {row.distance != undefined ? ("distance: " + row.distance) : ("")} score: {row.score} {list.hits[row.id] > 0 ? ("hits: " + list.hits[row.id]) : ("")}</span>
                                {/* <span>{row.name}, {row.distance > 0 ? ("distance: " +) : ()}, score: {row.score}, hits: {list.hits[row.id]}</span> */}
                            </li>  
                        )
                    })
                }
            </ul>
        )
    }
  
    const isListOpen = () : boolean => {
        if(typeList == 'services' && listOpen == 1)
        {
            return true;
        }
        if(typeList != 'services' && listOpen == 2)
        {
            return true;
        }
        return false;
    }
    return (
        <div className={"inputBox  " + typeList} id={typeList} onBlur={handleBlur}>
            <input 
                id={"input_" + typeList}
                aria-expanded={isListOpen()} 
                aria-controls={"inputBox_" + typeList}
                onFocus={handleClick}
                className="borderRadius" 
                type="search" 
                autoComplete="off" 
                name={"service_name" + typeList}
                placeholder={placeholder} 
                value={q || ''} 
                onChange={qTyping}
            />
            {
                isListOpen() && (
                    <div id={"inputBox_" + typeList} className={"boxList "} onFocus={handleClickInBox} >
                        <div className="suggestionList">
                            {results.totalDocuments > 0 && (
                            <div className="listBox">
                                {renderResults(results.results)}
                            </div>
                            )}
                            
                            {results.totalDocuments == 0  && history && history.length > 0 && (
                            <div className="listBox">
                                <span className="title">History</span>
                                {renderList(history, true)}
                            </div>
                            )}

                            {results.totalDocuments == 0  && popular && popular.length > 0 && (
                            <div className="listBox">
                                <span className="title">Popular</span>
                                {renderList(popular, false)}
                            </div>
                            )}
                        
                        </div>
                    </div>
                )
            }
            
    </div>
  )
}

export default SearchInput