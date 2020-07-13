import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from 'src/app/components/loading-dialog/loading-dialog.component';
import { MessageDialogComponent } from 'src/app/components/message-dialog/message-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('',[Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private authService: AuthService, 
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  async handleSubmit() {
    this.dialog.open(LoadingDialogComponent);
    const result = await this.authService.login(this.loginForm.value.username, this.loginForm.value.password);
    this.dialog.closeAll();
    if(result.success){
      this.router.navigate(["notes"]);
    }
    if(result.error){
      this.dialog.open(MessageDialogComponent, {data:{title:"ERROR", message: result.error.message}});
    }
  }

}
