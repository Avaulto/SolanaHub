import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Connection } from '@solana/web3.js';
import { tap } from 'rxjs';
import { isNotNullOrUndefined } from './internals';
import * as i0 from "@angular/core";
export const CONNECTION_CONFIG = new InjectionToken('connectionConfig');
export const connectionConfigProviderFactory = (config = {}) => ({
    provide: CONNECTION_CONFIG,
    useValue: {
        commitment: 'confirmed',
        ...config,
    },
});
export class ConnectionStore extends ComponentStore {
    constructor(_config) {
        super({
            connection: null,
            endpoint: null,
        });
        this._config = _config;
        this._endpoint$ = this.select(this.state$, ({ endpoint }) => endpoint);
        this.connection$ = this.select(this.state$, ({ connection }) => connection);
        this.setEndpoint = this.updater((state, endpoint) => ({
            ...state,
            endpoint,
        }));
        this.onEndpointChange = this.effect(() => this._endpoint$.pipe(isNotNullOrUndefined, tap((endpoint) => this.patchState({
            connection: new Connection(endpoint, this._config),
        }))));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: ConnectionStore, deps: [{ token: CONNECTION_CONFIG, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: ConnectionStore }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.2", ngImport: i0, type: ConnectionStore, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [CONNECTION_CONFIG]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi5zdG9yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2RhdGEtYWNjZXNzL3NyYy9saWIvY29ubmVjdGlvbi5zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsVUFBVSxFQUFvQixNQUFNLGlCQUFpQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0IsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sYUFBYSxDQUFDOztBQUVuRCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLGNBQWMsQ0FDbEQsa0JBQWtCLENBQ2xCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSwrQkFBK0IsR0FBRyxDQUM5QyxTQUEyQixFQUFFLEVBQzVCLEVBQUUsQ0FBQyxDQUFDO0lBQ0wsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixRQUFRLEVBQUU7UUFDVCxVQUFVLEVBQUUsV0FBVztRQUN2QixHQUFHLE1BQU07S0FDVDtDQUNELENBQUMsQ0FBQztBQVFILE1BQU0sT0FBTyxlQUFnQixTQUFRLGNBQStCO0lBVW5FLFlBR1MsT0FBeUI7UUFFakMsS0FBSyxDQUFDO1lBQ0wsVUFBVSxFQUFFLElBQUk7WUFDaEIsUUFBUSxFQUFFLElBQUk7U0FDZCxDQUFDLENBQUM7UUFMSyxZQUFPLEdBQVAsT0FBTyxDQUFrQjtRQVpqQixlQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FDeEMsSUFBSSxDQUFDLE1BQU0sRUFDWCxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FDMUIsQ0FBQztRQUNPLGdCQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FDakMsSUFBSSxDQUFDLE1BQU0sRUFDWCxDQUFDLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FDOUIsQ0FBQztRQWFPLGdCQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxRQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2pFLEdBQUcsS0FBSztZQUNSLFFBQVE7U0FDUixDQUFDLENBQUMsQ0FBQztRQUVLLHFCQUFnQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQzVDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUNuQixvQkFBb0IsRUFDcEIsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNmLFVBQVUsRUFBRSxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUNsRCxDQUFDLENBQ0YsQ0FDRCxDQUNELENBQUM7SUFoQkYsQ0FBQzs4R0FuQlcsZUFBZSxrQkFZbEIsaUJBQWlCO2tIQVpkLGVBQWU7OzJGQUFmLGVBQWU7a0JBRDNCLFVBQVU7OzBCQVlSLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbXBvbmVudFN0b3JlIH0gZnJvbSAnQG5ncngvY29tcG9uZW50LXN0b3JlJztcbmltcG9ydCB7IENvbm5lY3Rpb24sIENvbm5lY3Rpb25Db25maWcgfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuaW1wb3J0IHsgdGFwIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBpc05vdE51bGxPclVuZGVmaW5lZCB9IGZyb20gJy4vaW50ZXJuYWxzJztcblxuZXhwb3J0IGNvbnN0IENPTk5FQ1RJT05fQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuPENvbm5lY3Rpb25Db25maWc+KFxuXHQnY29ubmVjdGlvbkNvbmZpZydcbik7XG5cbmV4cG9ydCBjb25zdCBjb25uZWN0aW9uQ29uZmlnUHJvdmlkZXJGYWN0b3J5ID0gKFxuXHRjb25maWc6IENvbm5lY3Rpb25Db25maWcgPSB7fVxuKSA9PiAoe1xuXHRwcm92aWRlOiBDT05ORUNUSU9OX0NPTkZJRyxcblx0dXNlVmFsdWU6IHtcblx0XHRjb21taXRtZW50OiAnY29uZmlybWVkJyxcblx0XHQuLi5jb25maWcsXG5cdH0sXG59KTtcblxuaW50ZXJmYWNlIENvbm5lY3Rpb25TdGF0ZSB7XG5cdGNvbm5lY3Rpb246IENvbm5lY3Rpb24gfCBudWxsO1xuXHRlbmRwb2ludDogc3RyaW5nIHwgbnVsbDtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb25TdG9yZSBleHRlbmRzIENvbXBvbmVudFN0b3JlPENvbm5lY3Rpb25TdGF0ZT4ge1xuXHRwcml2YXRlIHJlYWRvbmx5IF9lbmRwb2ludCQgPSB0aGlzLnNlbGVjdChcblx0XHR0aGlzLnN0YXRlJCxcblx0XHQoeyBlbmRwb2ludCB9KSA9PiBlbmRwb2ludFxuXHQpO1xuXHRyZWFkb25seSBjb25uZWN0aW9uJCA9IHRoaXMuc2VsZWN0KFxuXHRcdHRoaXMuc3RhdGUkLFxuXHRcdCh7IGNvbm5lY3Rpb24gfSkgPT4gY29ubmVjdGlvblxuXHQpO1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdEBPcHRpb25hbCgpXG5cdFx0QEluamVjdChDT05ORUNUSU9OX0NPTkZJRylcblx0XHRwcml2YXRlIF9jb25maWc6IENvbm5lY3Rpb25Db25maWdcblx0KSB7XG5cdFx0c3VwZXIoe1xuXHRcdFx0Y29ubmVjdGlvbjogbnVsbCxcblx0XHRcdGVuZHBvaW50OiBudWxsLFxuXHRcdH0pO1xuXHR9XG5cblx0cmVhZG9ubHkgc2V0RW5kcG9pbnQgPSB0aGlzLnVwZGF0ZXIoKHN0YXRlLCBlbmRwb2ludDogc3RyaW5nKSA9PiAoe1xuXHRcdC4uLnN0YXRlLFxuXHRcdGVuZHBvaW50LFxuXHR9KSk7XG5cblx0cmVhZG9ubHkgb25FbmRwb2ludENoYW5nZSA9IHRoaXMuZWZmZWN0KCgpID0+XG5cdFx0dGhpcy5fZW5kcG9pbnQkLnBpcGUoXG5cdFx0XHRpc05vdE51bGxPclVuZGVmaW5lZCxcblx0XHRcdHRhcCgoZW5kcG9pbnQpID0+XG5cdFx0XHRcdHRoaXMucGF0Y2hTdGF0ZSh7XG5cdFx0XHRcdFx0Y29ubmVjdGlvbjogbmV3IENvbm5lY3Rpb24oZW5kcG9pbnQsIHRoaXMuX2NvbmZpZyksXG5cdFx0XHRcdH0pXG5cdFx0XHQpXG5cdFx0KVxuXHQpO1xufVxuIl19