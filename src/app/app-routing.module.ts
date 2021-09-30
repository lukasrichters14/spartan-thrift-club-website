import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {EventsComponent} from './events/events.component';
import {ConnectComponent} from './connect/connect.component';
import {UnsubscribeComponent} from './unsubscribe/unsubscribe.component';
import {ErrorComponent} from './error/error.component';


const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'events', component: EventsComponent},
  {path: 'connect', component: ConnectComponent},
  {path: 'unsubscribe', component: UnsubscribeComponent},
  {path: '**', pathMatch: 'full', component:ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
