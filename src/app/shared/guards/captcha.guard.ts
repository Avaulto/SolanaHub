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
    
    console.log('Guard triggered. Current URL segments:', activeRoute.snapshot.url);
    
    // Store the current URL to prevent loops
    const currentUrl = activeRoute.snapshot.url.map(segment => segment.path).join('/');
    
    // If we're already on the CAPTCHA route or attempting to navigate to it, allow it
    if (currentUrl === RoutingPath.CAPTCHA || 
        activeRoute.snapshot.url.some(segment => segment.path === RoutingPath.CAPTCHA)) {
        console.log('Already on CAPTCHA route or navigating to it, allowing');
        return of(true);
    }

    return captchaService.captchaVerified$.pipe(
        tap(isVerified => console.log('Captcha verification status:', isVerified)),
        map(isVerified => {
            if (!isVerified) {
                console.log('Captcha not verified, redirecting to CAPTCHA page');
                // Use Router.navigate instead of NavController to prevent loop
                navCtrl.navigateRoot([RoutingPath.CAPTCHA], { 
                    queryParams: activeRoute.snapshot.queryParams,
                    replaceUrl: true // This will replace the current URL in history
                });
                return false;
            }
            console.log('Captcha verified, allowing navigation');
            return true;
        }),
        catchError((error) => {
            console.error('Error in captcha guard:', error);
            navCtrl.navigateRoot([RoutingPath.NOT_CONNECTED], { 
                queryParams: activeRoute.snapshot.queryParams,
                replaceUrl: true
            });
            return of(false);
        })
    );
} 