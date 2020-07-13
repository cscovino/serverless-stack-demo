import { Component, OnInit, Input } from '@angular/core';
import { AmplifyService }  from 'aws-amplify-angular';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  signedIn: boolean;

  constructor(
    public amplifyService: AmplifyService, 
    private authService: AuthService, 
    private router: Router,
    public dialog: MatDialog
  ){
    this.amplifyService = amplifyService;
    this.amplifyService.authStateChange$.subscribe(authState => {
      this.signedIn = authState.state === 'signedIn';
      this.authService.user = authState.user;
      //if(this.signedIn) this.router.navigate(['notes']);
    })
  }

  ngOnInit() {
  }

  handleLogout(): void {
    this.dialog.open(LoadingDialogComponent);
    const success = this.authService.logout();
    this.dialog.closeAll();
    if(success){
      this.router.navigate(['login']);
    }
  }

}
