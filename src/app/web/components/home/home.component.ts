import { Component, OnInit, ViewChild }       from '@angular/core';

import { WeatherService }                     from './../../shared/services/weather.service';
import { Observable }                         from 'rxjs/Observable';
import { environment }                        from './../../../../environments/environment';
import { WeatherObject }                      from './../../shared/services/weather';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {

  weatherInfo = [];

  constructor( private weather: WeatherService) { }
    
  ngOnInit() {
    this.recoverDataFromStorage();
    this.getWeathers();
    Observable.interval(environment.refreshTime).subscribe(x => {
      this.getWeathers();
    });
  }

  getWeathers(){
    environment.cities.map( city => {
      this.weather.getWeatheritemsbyCity(city).subscribe( 
        result => {
          this.renderCityData(result);
      })
    })
  }


  /*
  * Add temperature to city or create new city if not exist yet. weatherInfo = [ [city1..{},{}] , [city2] , [city3] ]
  */
  renderCityData(result:WeatherObject){ 
      let verify = 0;
      for(let i = 0; i < this.weatherInfo.length; i++){
        if ( result.name === this.weatherInfo[i][0].name ){
          this.weatherInfo[i].unshift(result);
          // shows only last 7 in the view
          this.weatherInfo[i] = this.weatherInfo[i].slice(0,7)
          verify = 1;
          break;
        }
      }
      if (!verify) { this.weatherInfo[this.weatherInfo.length] = [result] }
  }

  /*
  * Look for a previous weather temperatures if exist in Storage
  */
  recoverDataFromStorage(){
    environment.cities.map( city => {
      if (localStorage.getItem(city) !== null) {
        this.weatherInfo.push(this.weather.getCityLocalStorage(city));
      }
    });
  }
  

}
