import { Routes } from '@angular/router';
import {RoutingPath} from "./shared/constants";
import { IsConnectedGuard } from './shared/guards/is-connected.guard';
import { inject } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { NotConnectedComponent } from './shared/layouts/not-connected/not-connected.component';
export const canActivate = (isConnected: boolean, walletService = inject(WalletStore)) => walletService.connected$;

export const routes: Routes = [
  {
    path: '',
    // redirectTo: RoutingPath.OVERVIEW,
    pathMatch: 'full',
    component: NotConnectedComponent
  },
  {
    path: RoutingPath.OVERVIEW,
    loadComponent: () => import('./pages/overview/overview.page').then( m => m.OverviewPage),
    
  },
  {
    path: RoutingPath.COLLECTIBLES,
    loadComponent: () => import('./pages/collectibles/collectibles.page').then( m => m.CollectiblesPage),
    
   
  },
  {
    path: RoutingPath.BRIDGE,
    loadComponent: () => import('./pages/bridge/bridge.page').then( m => m.BridgePage),
    
  },
  {
    path: RoutingPath.LOYALTY_LEAGUE,
    loadComponent: () => import('./pages/loyalty-league/loyalty-league.page').then( m => m.LoyaltyLeaguePage),
    
  },
  {
    path: `${RoutingPath.SWAP}/:pair`,
    loadComponent: () => import('./pages/swap/swap.page').then( m => m.SwapPage),
    
  },
  {
    path: RoutingPath.SWAP,
    loadComponent: () => import('./pages/swap/swap.page').then( m => m.SwapPage),
    
  },
  {
    path: RoutingPath.STAKING,
    loadComponent: () => import('./pages/staking/staking.page').then( m => m.StakingPage),
    
  },
  {
    path: RoutingPath.STASH,
    loadComponent: () => import('./pages/stash/stash.page').then( m => m.StashPage)
  },
  {
    path: RoutingPath.LENDING,
    loadComponent: () => import('./pages/lending/lending.page').then( m => m.LendingPage),
    
  },
  {
    path: RoutingPath.DAO,
    loadComponent: () => import('./pages/dao/dao.page').then( m => m.DaoPage),
    
  },
  {
    path: RoutingPath.AIRDROP_FINDER,
    loadComponent: () => import('./pages/airdrop-finder/airdrop-finder.page').then( m => m.AirdropFinderPage),
    
  },
  {
    path: RoutingPath.NOTIFICATIONS,
    loadComponent: () => import('./pages/notifications/notifications.page').then( m => m.NotificationsPage),
    
  },
  {
    path: RoutingPath.HUBSOL,
    loadComponent: () => import('./pages/hubsol/hubsol.page').then( m => m.HubsolPage)
  },
  {
    path:"**",
    redirectTo: RoutingPath.OVERVIEW
  },
<<<<<<< HEAD
=======







>>>>>>> main
];
