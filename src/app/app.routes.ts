import { Routes } from '@angular/router';
import {RoutingPath} from "./shared/constants";
import { IsConnectedGuard } from './shared/guards/is-connected.guard';
import { inject } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
export const canActivate = (isConnected: boolean, walletService = inject(WalletStore)) => walletService.connected$;

export const routes: Routes = [
  {
    path: '',
    redirectTo: RoutingPath.OVERVIEW,
    pathMatch: 'full',
  },
  // {
  //   path: `RoutingPath.FOLDER/:id`,
  //   loadComponent: () =>
  //     import('./folder/folder.page').then((m) => m.FolderPage),
  // },
  {
    path: RoutingPath.OVERVIEW,
    loadComponent: () => import('./pages/overview/overview.page').then( m => m.OverviewPage),
  },
  {
    path: RoutingPath.COLLECTIBLES,
    loadComponent: () => import('./pages/collectibles/collectibles.page').then( m => m.CollectiblesPage),
    // redirectTo: RoutingPath.OVERVIEW,
    canActivate: [IsConnectedGuard],
  },
  {
    path: RoutingPath.BRIDGE,
    loadComponent: () => import('./pages/bridge/bridge.page').then( m => m.BridgePage),
    canActivate: [IsConnectedGuard],
  },
  {
    path: RoutingPath.LOYALTY_LEAGUE,
    loadComponent: () => import('./pages/loyalty-league/loyalty-league.page').then( m => m.LoyaltyLeaguePage),
    canActivate: [IsConnectedGuard],
  },
  {
    path: `${RoutingPath.SWAP}/:pair`,
    loadComponent: () => import('./pages/swap/swap.page').then( m => m.SwapPage),
    canActivate: [IsConnectedGuard],
  },
  {
    path: RoutingPath.SWAP,
    loadComponent: () => import('./pages/swap/swap.page').then( m => m.SwapPage),
    canActivate: [IsConnectedGuard],
  },
  {
    path: RoutingPath.STAKING,
    loadComponent: () => import('./pages/staking/staking.page').then( m => m.StakingPage),
    canActivate: [IsConnectedGuard],
  },
  {
    path: RoutingPath.LENDING,
    loadComponent: () => import('./pages/lending/lending.page').then( m => m.LendingPage),
    canActivate: [IsConnectedGuard],
  },
  {
    path: RoutingPath.LIQUIDITY_POOLS,
    loadComponent: () => import('./pages/liquidity-pools/liquidity-pools.page').then( m => m.LiquidityPoolsPage),
    canActivate: [IsConnectedGuard],
  },
  {
    path: RoutingPath.DAO,
    loadComponent: () => import('./pages/dao/dao.page').then( m => m.DaoPage),
    canActivate: [IsConnectedGuard],
  },
  {
    path: RoutingPath.AIRDROP_FINDER,
    loadComponent: () => import('./pages/airdrop-finder/airdrop-finder.page').then( m => m.AirdropFinderPage),
    canActivate: [IsConnectedGuard],
  },
  {
    path: RoutingPath.NOTIFICATIONS,
    loadComponent: () => import('./pages/notifications/notifications.page').then( m => m.NotificationsPage),
    canActivate: [IsConnectedGuard],
  },
  {
    path:"**",
    redirectTo: RoutingPath.OVERVIEW
  },






];
