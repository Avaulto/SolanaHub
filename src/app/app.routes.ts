import { Routes } from '@angular/router';
import {RoutingPath} from "./shared/constants";

import { NotConnectedComponent } from './shared/layouts/not-connected/not-connected.component';
import { environment } from '../environments/environment';
import { isConnectedGuard } from './shared/guards/is-connected.guard';
import { captchaGuard } from './shared/guards/captcha.guard';


const stashBeta = new URLSearchParams(window.location.search).get('beta')
console.log(stashBeta);

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: RoutingPath.OVERVIEW
    
  },
  {
    path: RoutingPath.OVERVIEW,
    loadComponent: () => import('./pages/overview/overview.page').then( m => m.OverviewPage),
    canActivate: [ isConnectedGuard]
  },
  {
    path: RoutingPath.STASH,
    loadComponent: () => import('./pages/stash/stash.page').then( m => m.StashPage),
    canActivate: [isConnectedGuard]
  },
  {
    path: RoutingPath.COLLECTIBLES,
    loadComponent: () => import('./pages/collectibles/collectibles.page').then( m => m.CollectiblesPage),
    canActivate: [isConnectedGuard]
  },
  {
    path: RoutingPath.BRIDGE,
    loadComponent: () => import('./pages/bridge/bridge.page').then( m => m.BridgePage), 
    canActivate: [isConnectedGuard]
  },
  {
    path: RoutingPath.LOYALTY_LEAGUE,
    loadComponent: () => import('./pages/loyalty-league/loyalty-league.page').then( m => m.LoyaltyLeaguePage),
    canActivate: [isConnectedGuard]
  },
  {
    path: `${RoutingPath.SWAP}/:pair`,
    loadComponent: () => import('./pages/swap/swap.page').then( m => m.SwapPage),
    canActivate: [isConnectedGuard]
  },
  {
    path: RoutingPath.SWAP,
    loadComponent: () => import('./pages/swap/swap.page').then( m => m.SwapPage),
    canActivate: [isConnectedGuard]
  },
  {
    path: RoutingPath.STAKING,
    loadComponent: () => import('./pages/staking/staking.page').then( m => m.StakingPage),
    canActivate: [isConnectedGuard]
  },
  {
    path: RoutingPath.DAO,
    loadComponent: () => import('./pages/dao/dao.page').then( m => m.DaoPage),
    canActivate: [isConnectedGuard]
  },
  {
    path: RoutingPath.AIRDROP_FINDER,
    loadComponent: () => import('./pages/airdrop-finder/airdrop-finder.page').then( m => m.AirdropFinderPage),
    canActivate: [isConnectedGuard]
  },
  {
    path: RoutingPath.NOTIFICATIONS,
    loadComponent: () => import('./pages/notifications/notifications.page').then( m => m.NotificationsPage),
    canActivate: [isConnectedGuard]
  },
  {
    path: RoutingPath.HUBSOL,
    loadComponent: () => import('./pages/hubsol/hubsol.page').then( m => m.HubsolPage)
  },
  {
    path: RoutingPath.NOT_CONNECTED,
    component: NotConnectedComponent
  },
  {
    path:"**",
    redirectTo: RoutingPath.OVERVIEW
  },
];
