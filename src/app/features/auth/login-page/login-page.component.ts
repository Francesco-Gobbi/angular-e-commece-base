import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {setAuth} from "../../../state/auth/actions";
import {Observable} from "rxjs";
import {selectIsLoading} from "../../../state/auth/selectors";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  loading$: Observable<boolean>;

  loginForm: FormGroup;
  hidePassword = true;

  constructor(private store: Store) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.loading$ = this.store.select(selectIsLoading);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log(email, password);
      this.store.dispatch(setAuth({ email, password }));
    }
  }

  getEmailErrorMessage() {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    }
    return emailControl?.hasError('email') ? 'Invalid email format' : '';
  }

  getPasswordErrorMessage() {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    return passwordControl?.hasError('minlength') ? 'Minimum 6 characters' : '';
  }
}
