import Store, {AppState} from '../redux/store';

class Search {
    public async queryLocations(q: string): Promise<any> {
        // @ts-ignore
        const locations = await Store.getState().locations;
        let results:any = [];
        q = q.toLowerCase();

        for (const key in locations.list) {
            let name = locations.list[key].name.toLowerCase();
            if(name.startsWith(q)) {
                let nameScore = Search.getNameScore(name, q);

                results[key] = {
                    id: key,
                    name: locations.list[key].name,
                    score: nameScore,
                    position: locations.list[key].position
                }
            }
        }

        return {
            totalHits: 0,
            totalDocuments: results.length,
            results: Search.sort(results)
        };
    }

    public async query(q: string): Promise<any> {
        // @ts-ignore
        const locations = await Store.getState().locations;
        // @ts-ignore
        const services =  await Store.getState().services;
        let results:any = [];
        let currentPosition = Search.getCurrentPosition(locations);

        q = q.toLowerCase();

        for (const key in services.list) {
            let name = services.list[key].name.toLowerCase();
            if(name.startsWith(q)) {
                let distance = Search.getDistance(services.list[key].position, currentPosition);
                let nameScore = Search.getNameScore(name, q);
                let totalScore = Search.getScore(Search.getDistanceScore(distance), nameScore);

                results[key] = {
                    id: key,
                    name: services.list[key].name,
                    distance: Search.prettyDistance(distance),
                    score: totalScore,
                    position: services.list[key].position
                }
            }
        }

        return Search.prepareResults(results, services);
    }

    public static getCurrentPosition(locations: any) {
        
        if(locations.selected == 1)
        {
            return locations.currentLocation.position;
        }

        return locations.list[locations.selected].position;
    }

    public static prepareResults (results: [], services: any) {
        let hits:number = 0;
        let total:number = 0;
        for(const key in results) {
            total++;
            if(services.hits[key]) {
                hits = hits + services.hits[key];
            }
        }

        return {
            totalHits: hits,
            totalDocuments: total,
            results: Search.sort(results)
        }
    }

    public static sort = (found: any) => {
        return found.sort((a: any, b: any) => b.score - a.score);
    }

    public static getDistance = (position: {lat: number, lng: number}, currentPosition: {lat: number, lng: number}) => {
        if ((position.lat == currentPosition.lat) && (position.lng == currentPosition.lng)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * position.lat/180;
            var radlat2 = Math.PI * currentPosition.lat/180;
            var theta = position.lng-currentPosition.lng;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515 * 1.609344;
            
            return dist;
        }
    }

    public static getNameScore = (name: string, q: string) => {
        let nameLenght = name.length;
        let qLenght = q.length;

        return (qLenght/nameLenght) * 100;
    }

    public static getDistanceScore = (distance: number) => {
        if(distance < 1) {
            return 100;
        }
        if(distance < 5) {
            return 50;
        }

        return 0;
    }

    public static getScore = (distanceScore: number, nameScore: number) => {
        return ((distanceScore + nameScore) / 2).toFixed(0);
    }

    public static prettyDistance =(distance: number) => {
        if(distance < 1) {
            return (distance/1000).toFixed(1)+"m"
        }

        return distance.toFixed(1)+"km";
    }
}

export default new Search;