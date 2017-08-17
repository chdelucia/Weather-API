import { Injectable, Inject }                           from '@angular/core';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';

import { Observable }                                   from 'rxjs/Observable';
import 'rxjs/Rx';

import { environment }                                  from './../../../../environments/environment';
import { WeatherObject }                                from './weather';
import * as moment                                      from 'moment-timezone';

@Injectable()
export class WeatherService {

    constructor(private http: Http) { }

    getWeatheritemsbyCity(cityName: string): Observable<WeatherObject> {

        return this.http.get(environment.baseUrl + 'weather?q=' + cityName + '&appid=' + environment.appId + '&units=metric')
            .retry(3)
            .map(response => this.setCityLocalStorage( cityName,response.json() ))
            .catch(this.handleError);
    }

    setCityLocalStorage(cityName:string,weatherJson:WeatherObject) : WeatherObject {
        let weatherObject = this.addCurrentDateTime(cityName,weatherJson);
        let temperatures : WeatherObject[] = []; 

        if (localStorage.getItem(weatherObject.name) === null) {
            temperatures.push(weatherObject);
            localStorage.setItem(cityName, JSON.stringify(temperatures));
        }
        else {
            temperatures = this.getCityLocalStorage(weatherObject.name);
            temperatures.push(weatherObject);
            localStorage[weatherObject.name] = JSON.stringify(temperatures);
        }
        return weatherObject;
    }

    getCityLocalStorage(cityName: string): WeatherObject[] {
            return JSON.parse(localStorage.getItem(cityName));
    }


    /*
    * add current date Time from city timezone
    */
    private addCurrentDateTime(city:string, weatherObject:WeatherObject) : WeatherObject {
        let cityName = this.prepareCityNameForMoment(city)
        weatherObject.date = moment().tz("America/" + cityName).format('HH:mm');
        return weatherObject;
    }

    /*
    * Remove blank space and add _ instead
    */
    private prepareCityNameForMoment(cityName: string): string {
        return cityName.replace(' ', '_');
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.text || ' error');
    }

}
