import { Component, OnInit } from '@angular/core';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { MatCard } from "@angular/material/card";
import { NgIf } from "@angular/common";
import { SnackBarService } from "../../../shared/components/snack-bar/service/snack-bar.service";
import { Store } from "@ngrx/store";
import { selectUser } from "../../../state/auth/selectors";
import { Observable } from "rxjs";
import { User } from "../../../shared/types";
import {clearAuth, updateUser} from "../../../state/auth/actions";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {update} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    FormsModule,
    MatInput,
    MatButton,
    MatCard,
    NgIf,
    MatDivider,
    MatIcon
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {
  user$: Observable<User | null>;
  user: User | null = null;

  role: string = '';
  name: string = '';
  email: string = '';

  constructor(private snackBarService: SnackBarService, private store: Store) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit() {
    this.user$.subscribe(user => {
      if (user) {
        console.log(user);
        this.user = user;
        this.role = user.role;
        this.email = user.email;
        this.name = user.name;
      }
    });
  }

  save() {
    if (this.user) {
      const updatedUser: User = {
        ...this.user,
        role: this.role,
        email: this.email,
        name: this.name
      };
      this.store.dispatch(updateUser({ user: updatedUser }));
    }
  }

  logOut() {
    console.log('logout')
    this.store.dispatch(clearAuth());
  }
}
