import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import { WeatherObject } from './weather';
import moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);

  getWeatheritemsbyCity(cityName: string): Observable<WeatherObject> {
    return this.http
      .get<WeatherObject>(
        environment.baseUrl + 'weather?q=' + cityName + '&appid=' + environment.appId + '&units=metric'
      )
      .pipe(
        retry(3),
        map(response => this.setCityLocalStorage(cityName, response)),
        catchError(this.handleError)
      );
  }

  setCityLocalStorage(cityName: string, weatherJson: WeatherObject): WeatherObject {
    let weatherObject = this.addCurrentDateTime(cityName, weatherJson);
    let temperatures: WeatherObject[] = [];

    if (localStorage.getItem(weatherObject.name) === null) {
      temperatures.push(weatherObject);
      localStorage.setItem(cityName, JSON.stringify(temperatures));
    } else {
      temperatures = this.getCityLocalStorage(weatherObject.name);
      temperatures.unshift(weatherObject);
      localStorage[weatherObject.name] = JSON.stringify(temperatures);
    }
    return weatherObject;
  }

  getCityLocalStorage(cityName: string): WeatherObject[] {
    const data = localStorage.getItem(cityName);
    return data ? JSON.parse(data) : [];
  }

  /*
  * add current date Time from city timezone
  */
  private addCurrentDateTime(city: string, weatherObject: WeatherObject): WeatherObject {
    let cityName = this.prepareCityNameForMoment(city);
    weatherObject.date = moment().tz('America/' + cityName).format('HH:mm');
    return weatherObject;
  }

  /*
  * Remove blank space and add _ instead
  */
  private prepareCityNameForMoment(cityName: string): string {
    return cityName.replace(' ', '_');
  }

  private handleError(error: any) {
    console.error(error);
    return throwError(() => error?.message || ' error');
  }
}
