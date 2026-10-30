import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../shared/services/weather.service';
import { environment } from '../../../../environments/environment';
import { WeatherObject } from '../../shared/services/weather';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, OnDestroy {
  private weather = inject(WeatherService);
  private timerSub?: Subscription;

  readonly weatherInfo = signal<WeatherObject[][]>([]);

  ngOnInit(): void {
    this.recoverDataFromStorage();
    this.getWeathers();
    this.timerSub = interval(environment.refreshTime).subscribe(() => {
      this.getWeathers();
    });
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  getWeathers(): void {
    environment.cities.map(city => {
      this.weather.getWeatheritemsbyCity(city).subscribe(result => {
        this.renderCityData(result);
      });
    });
  }

  /*
  * Add temperature to city or create new city if not exist yet. weatherInfo = [ [city1..{},{}] , [city2] , [city3] ]
  */
  renderCityData(result: WeatherObject): void {
    this.weatherInfo.update(currentInfo => {
      const updatedInfo = currentInfo.map(cityArray => [...cityArray]);
      let verify = false;

      for (let i = 0; i < updatedInfo.length; i++) {
        if (updatedInfo[i][0] && result.name === updatedInfo[i][0].name) {
          updatedInfo[i].unshift(result);
          // shows only last 7 in the view
          updatedInfo[i] = updatedInfo[i].slice(0, 7);
          verify = true;
          break;
        }
      }

      if (!verify) {
        updatedInfo.push([result]);
      }

      return updatedInfo;
    });
  }

  /*
  * Look for a previous weather temperatures if exist in Storage
  */
  recoverDataFromStorage(): void {
    const initialData: WeatherObject[][] = [];
    environment.cities.forEach(city => {
      if (localStorage.getItem(city) !== null) {
        initialData.push(this.weather.getCityLocalStorage(city));
      }
    });
    if (initialData.length > 0) {
      this.weatherInfo.set(initialData);
    }
  }
}
