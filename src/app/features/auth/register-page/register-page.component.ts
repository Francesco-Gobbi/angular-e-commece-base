import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthApiService } from "../../../core/services/api/auth-api/auth-api.service";
import { Store } from "@ngrx/store";
import { setAuth } from "../../../state/auth/actions";
import { Observable } from "rxjs";
import { selectIsLoading } from "../../../state/auth/selectors";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthApiService);
  private router = inject(Router);
  
  loading$: Observable<boolean>;
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(private store: Store) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    this.loading$ = this.store.select(selectIsLoading);
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value 
      ? null 
      : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      this.authService.post('auth/register', { name, email, password }).subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error('Registration error:', err);
        }
      });
    }
  }

 getNomeErrorMessage() {
    const nomeControl = this.registerForm.get('name');
    return nomeControl?.hasError('required') ? 'Il nome è obbligatorio' : '';
  }

  getEmailErrorMessage() {
      const emailControl = this.registerForm.get('email');
      if (emailControl?.hasError('required')) {
          return 'L\'email è obbligatoria';
      }
      return emailControl?.hasError('email') ? 'Formato email non valido' : '';
  }

  getPasswordErrorMessage() {
      const passwordControl = this.registerForm.get('password');
      if (passwordControl?.hasError('required')) {
          return 'La password è obbligatoria';
      }
      return passwordControl?.hasError('minlength') ? 'Minimo 6 caratteri' : '';
  }

  getConfermaPasswordErrorMessage() {
      const confermaControl = this.registerForm.get('confirmPassword');
      if (confermaControl?.hasError('required')) {
          return 'Conferma la password';
      }
      return this.registerForm.hasError('mismatch') ? 'Le password non coincidono' : '';
  }
  }