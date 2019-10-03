import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StateService } from './core/services/state.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    private stateService: StateService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    console.log("TCL: AppComponent -> initializeApp -> this.platform", this.platform)
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE).catch(err => {
      console.error(err)
    })
    this.platform.ready().then(() => {
      this.statusBar.hide();
      this.splashScreen.hide();

      // this.androidFullScreen.isImmersiveModeSupported().then(() => {
      //   this.androidFullScreen.immersiveMode()
      // }).catch(err => {
      //   console.error(err)
      // })
    });
    this.stateService.InitializeState(); // Can be removed?
  }
}
