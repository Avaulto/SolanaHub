import {computed, inject, Injectable, Signal, signal} from "@angular/core";
import {JupStoreService} from "./jup-store.service";
import {PortfolioService} from "./portfolio.service";

@Injectable({
  providedIn: 'root'
})
export class PortfolioBreakdownService {
  public readonly _jupStore = inject(JupStoreService)
  public readonly _portfolioService = inject(PortfolioService)

  private excludedAssets = signal<Set<string>>(new Set());

  public getAllWalletsAssets: Signal<any[]> = computed(() => {
    return this._portfolioService.portfolio()
      .filter(({ portfolio }) => portfolio.enabled)
      .map(({ portfolio}) => portfolio.walletAssets)
      .flat()
  });

  public portfolioTotalUsdValue: Signal<number> = computed(() => {
    const assets = this.getAllWalletsAssets();
    if (!assets) return 0;

    return assets
      .filter(data => data?.value && !this.excludedAssets().has(data?.label))
      .reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
  });

  public portfolioValueInSOL: Signal<number> = computed(() =>
    this.portfolioTotalUsdValue() / this._jupStore.solPrice())

  toggleAssetExclusion(group: string): void {
    const normalizedGroup = group.replace(/\s+/g, '');
    this.excludedAssets.update(set => {
      const newSet = new Set(set);
      if (newSet.has(normalizedGroup)) {
        newSet.delete(normalizedGroup);
      } else {
        newSet.add(normalizedGroup);
      }
      console.log(newSet)
      return newSet;
    });
  }

  public assetClassValue = computed(() => {
    const assets = this.getAllWalletsAssets();

    if (!assets) return [];
    return assets
      .map(assetClass => ({
        group: assetClass?.label ? (assetClass?.label === 'NFTs' ? 'NFTs' : assetClass?.label.replace(/([A-Z])/g, ' $1').trim()) : assetClass?.label,
        value: assetClass?.value,
        color: this.colorPicker(assetClass?.label),
        excluded: this.excludedAssets().has(assetClass?.label)
      }))
      .reduce((a, c) => {
        const obj = a.find((obj) => obj.group === c.group);
        if (!obj) {
          a.push(c);
        } else {
          obj.value += c.value;
          obj.excluded = obj.excluded && c.excluded;
        }
        return a;
      }, [])
      .filter(asset => asset.value > 0)
      .sort((a, b) => b.value - a.value);
  });

  private getRandomColor(): string {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private colorPicker(assetClass: string): string {
    let color = ''

    switch (assetClass) {
      case 'Wallet':
        color = '#341663'
        break;
      case 'Staked':
        color = '#7209B7'
        break;
      case 'NFTs':
        color = '#F7E8FF'
        break;

      case 'LiquidityPool':
        color = '#560BAD'
        break;
      case 'Lending':
        color = '#B5179E'
        break;
      case 'Rewards':
        color = '#F72585'
        break;
      case 'Airdrop':
        color = '#b82568'
        break;
      case 'Deposit':
        color = '#E9CDC2'
        break;
      case 'Farming':
        color = '#341663'
        break;
      case 'Vesting':
        color = '#b58ef2'
        break;
      case 'Leverage':
        color = '#8ea3f2'
        break;
      default:
        color = this.getRandomColor()
        break;
    }

    return color
  }
}
