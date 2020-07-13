import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from 'src/app/components/loading-dialog/loading-dialog.component';
import { MessageDialogComponent } from 'src/app/components/message-dialog/message-dialog.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm = new FormGroup({
    username: new FormControl('',[Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
    secondpassword: new FormControl('', [Validators.required])
  });
  confirmationForm = new FormGroup({
    confirmationCode: new FormControl('',[Validators.required])
  });
  isUserSignUp = null;

  constructor(
    private authService: AuthService, 
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.isUserSignUp = this.authService.user !== null;
  }

  async handleSubmit() {
    if(this.signupForm.value.password === this.signupForm.value.secondpassword){
      const load = this.dialog.open(LoadingDialogComponent);
      const result = await this.authService.signup(this.signupForm.value.username, this.signupForm.value.password);
      load.close();
      if(result.success){
        this.isUserSignUp = result.success;
      } else if(result.error){
        this.dialog.open(MessageDialogComponent, {data:{title:"ERROR", message: result.error.message}});
      }
    } else {
      this.dialog.open(MessageDialogComponent, {data:{title: "ERROR", message: "Passwords are different."}})
    }
  }

  async handleConfirmation() {
    const load = this.dialog.open(LoadingDialogComponent);
    const result = await this.authService.confirmSignup(this.authService.user.username, this.confirmationForm.value.confirmationCode);
    load.close();
    if(result.success){
      this.isUserSignUp = false;
      this.router.navigate(["login"])
    } else if(result.error){
      this.dialog.open(MessageDialogComponent, {data:{title:"ERROR", message: result.error.message}});
    }
  }

}
