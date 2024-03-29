import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckersComponent } from './checkers/checkers.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { ConnectFourComponent } from './connect-four/connect-four.component';
import { WarComponent } from './war/war.component';
import { BlackjackComponent } from './blackjack/blackjack.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  //{ path: '', component: AppComponent },
  { path: 'tic-tac-toe', component: TicTacToeComponent },
  { path: 'checkers', component: CheckersComponent },
  { path: 'connect-four', component: ConnectFourComponent },
  { path: 'war', component: WarComponent },
  { path: 'blackjack', component: BlackjackComponent },
  { path: '', redirectTo: '/tic-tac-toe', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
