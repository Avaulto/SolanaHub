import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaptchaService } from 'src/app/services/captcha.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { RoutingPath } from '../constants/routes';
import { NavController } from '@ionic/angular';


export const captchaGuard = () => {
    const captchaService = inject(CaptchaService);
    const navCtrl = inject(NavController);
    const activeRoute = inject(ActivatedRoute);
    
    return captchaService.captchaVerified$.pipe(
        map(isVerified => {
            console.log('isVerified', isVerified);
                if (!isVerified) {
                    const queryParams = activeRoute.snapshot.queryParams;
                    navCtrl.navigateForward([RoutingPath.CAPTCHA], { queryParams });
                }
                return isVerified;
            }),
            catchError(() => {
                // preserve query params
                const queryParams = activeRoute.snapshot.queryParams;
                navCtrl.navigateBack([RoutingPath.NOT_CONNECTED], { queryParams });
                return of(false);
              })
        );
} 