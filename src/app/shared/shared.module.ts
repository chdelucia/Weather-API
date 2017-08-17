import { NgModule }                                         from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { RouterModule }                                     from '@angular/router';
import { HttpModule }                                       from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpModule
  ],
  exports: [
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
