import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoderesComponent } from './components/poderes/poderes.component';
import { Poderes2Component } from './components/poderes2/poderes2.component';
const routes: Routes = [
  { path: 'poderes', component: PoderesComponent },
  { path: 'poderes2', component: Poderes2Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
