import { Routes } from '@angular/router';
import { IsConnectedGuard } from './shared/guards/is-connected.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  // {
  //   path: 'folder/:id',
  //   loadComponent: () =>
  //     import('./folder/folder.page').then((m) => m.FolderPage),
  // },
  {
    path: 'overview',
    loadComponent: () => import('./pages/overview/overview.page').then( m => m.OverviewPage),
  },
  {
    path: 'collectibles',
    loadComponent: () => import('./pages/collectibles/collectibles.page').then( m => m.CollectiblesPage)
  },
  {
    path: 'loyalty-league',
    loadComponent: () => import('./pages/loyalty-league/loyalty-league.page').then( m => m.LoyaltyLeaguePage)
  },
  {
    path: 'swap/:pair',
    loadComponent: () => import('./pages/swap/swap.page').then( m => m.SwapPage)
  },
  {
    path: 'swap',
    loadComponent: () => import('./pages/swap/swap.page').then( m => m.SwapPage)
  },
  {
    path: 'staking',
    loadComponent: () => import('./pages/staking/staking.page').then( m => m.StakingPage)
  },
  {
    path: 'lending',
    loadComponent: () => import('./pages/lending/lending.page').then( m => m.LendingPage)
  },
  {
    path: 'liquidity-pools',
    loadComponent: () => import('./pages/liquidity-pools/liquidity-pools.page').then( m => m.LiquidityPoolsPage)
  },
  {
    path: 'dao',
    loadComponent: () => import('./pages/dao/dao.page').then( m => m.DaoPage)
  },

  {
    path:"**",
    redirectTo:'overview'
  },


];
