
import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { WeatherService }        from './services/weather.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [], 
  providers: [ 
    WeatherService
  ]
})
export class SharedModule { }
