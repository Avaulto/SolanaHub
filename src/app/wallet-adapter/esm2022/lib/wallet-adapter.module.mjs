import { NgModule } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { ConnectionStore, connectionConfigProviderFactory, } from './connection.store';
import { WalletStore, walletConfigProviderFactory, } from './wallet.store';
import * as i0 from "@angular/core";
export function provideWalletAdapter(walletConfig, connectionConfig) {
    return [
        walletConfigProviderFactory(walletConfig),
        connectionConfigProviderFactory(connectionConfig),
        provideComponentStore(WalletStore),
        provideComponentStore(ConnectionStore),
    ];
}
export class HdWalletAdapterModule {
    static forRoot(walletConfig, connectionConfig) {
        return {
            ngModule: HdWalletAdapterModule,
            providers: [
                walletConfigProviderFactory(walletConfig),
                connectionConfigProviderFactory(connectionConfig),
                ConnectionStore,
                WalletStore,
            ],
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: HdWalletAdapterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.2", ngImport: i0, type: HdWalletAdapterModule }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: HdWalletAdapterModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: HdWalletAdapterModule, decorators: [{
            type: NgModule,
            args: [{}]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FsbGV0LWFkYXB0ZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZGF0YS1hY2Nlc3Mvc3JjL2xpYi93YWxsZXQtYWRhcHRlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQVksTUFBTSxlQUFlLENBQUM7QUFDeEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFOUQsT0FBTyxFQUNMLGVBQWUsRUFDZiwrQkFBK0IsR0FDaEMsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QixPQUFPLEVBRUwsV0FBVyxFQUNYLDJCQUEyQixHQUM1QixNQUFNLGdCQUFnQixDQUFDOztBQUV4QixNQUFNLFVBQVUsb0JBQW9CLENBQ2xDLFlBQW1DLEVBQ25DLGdCQUFtQztJQUVuQyxPQUFPO1FBQ0wsMkJBQTJCLENBQUMsWUFBWSxDQUFDO1FBQ3pDLCtCQUErQixDQUFDLGdCQUFnQixDQUFDO1FBQ2pELHFCQUFxQixDQUFDLFdBQVcsQ0FBQztRQUNsQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUM7S0FDdkMsQ0FBQztBQUNKLENBQUM7QUFHRCxNQUFNLE9BQU8scUJBQXFCO0lBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQ1osWUFBbUMsRUFDbkMsZ0JBQW1DO1FBRW5DLE9BQU87WUFDTCxRQUFRLEVBQUUscUJBQXFCO1lBQy9CLFNBQVMsRUFBRTtnQkFDVCwyQkFBMkIsQ0FBQyxZQUFZLENBQUM7Z0JBQ3pDLCtCQUErQixDQUFDLGdCQUFnQixDQUFDO2dCQUNqRCxlQUFlO2dCQUNmLFdBQVc7YUFDWjtTQUNGLENBQUM7SUFDSixDQUFDOzhHQWRVLHFCQUFxQjsrR0FBckIscUJBQXFCOytHQUFyQixxQkFBcUI7OzJGQUFyQixxQkFBcUI7a0JBRGpDLFFBQVE7bUJBQUMsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlLCBQcm92aWRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgcHJvdmlkZUNvbXBvbmVudFN0b3JlIH0gZnJvbSAnQG5ncngvY29tcG9uZW50LXN0b3JlJztcbmltcG9ydCB7IENvbm5lY3Rpb25Db25maWcgfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuaW1wb3J0IHtcbiAgQ29ubmVjdGlvblN0b3JlLFxuICBjb25uZWN0aW9uQ29uZmlnUHJvdmlkZXJGYWN0b3J5LFxufSBmcm9tICcuL2Nvbm5lY3Rpb24uc3RvcmUnO1xuaW1wb3J0IHtcbiAgV2FsbGV0Q29uZmlnLFxuICBXYWxsZXRTdG9yZSxcbiAgd2FsbGV0Q29uZmlnUHJvdmlkZXJGYWN0b3J5LFxufSBmcm9tICcuL3dhbGxldC5zdG9yZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlV2FsbGV0QWRhcHRlcihcbiAgd2FsbGV0Q29uZmlnOiBQYXJ0aWFsPFdhbGxldENvbmZpZz4sXG4gIGNvbm5lY3Rpb25Db25maWc/OiBDb25uZWN0aW9uQ29uZmlnXG4pOiBQcm92aWRlcltdIHtcbiAgcmV0dXJuIFtcbiAgICB3YWxsZXRDb25maWdQcm92aWRlckZhY3Rvcnkod2FsbGV0Q29uZmlnKSxcbiAgICBjb25uZWN0aW9uQ29uZmlnUHJvdmlkZXJGYWN0b3J5KGNvbm5lY3Rpb25Db25maWcpLFxuICAgIHByb3ZpZGVDb21wb25lbnRTdG9yZShXYWxsZXRTdG9yZSksXG4gICAgcHJvdmlkZUNvbXBvbmVudFN0b3JlKENvbm5lY3Rpb25TdG9yZSksXG4gIF07XG59XG5cbkBOZ01vZHVsZSh7fSlcbmV4cG9ydCBjbGFzcyBIZFdhbGxldEFkYXB0ZXJNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChcbiAgICB3YWxsZXRDb25maWc6IFBhcnRpYWw8V2FsbGV0Q29uZmlnPixcbiAgICBjb25uZWN0aW9uQ29uZmlnPzogQ29ubmVjdGlvbkNvbmZpZ1xuICApOiBNb2R1bGVXaXRoUHJvdmlkZXJzPEhkV2FsbGV0QWRhcHRlck1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogSGRXYWxsZXRBZGFwdGVyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHdhbGxldENvbmZpZ1Byb3ZpZGVyRmFjdG9yeSh3YWxsZXRDb25maWcpLFxuICAgICAgICBjb25uZWN0aW9uQ29uZmlnUHJvdmlkZXJGYWN0b3J5KGNvbm5lY3Rpb25Db25maWcpLFxuICAgICAgICBDb25uZWN0aW9uU3RvcmUsXG4gICAgICAgIFdhbGxldFN0b3JlLFxuICAgICAgXSxcbiAgICB9O1xuICB9XG59XG4iXX0=