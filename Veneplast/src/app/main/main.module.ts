import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main.router';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MainRoutingModule,
    HttpClientModule
  ],
  providers: [
    provideHttpClient(withFetch()) 
  ]
})
export class MainModule { }
