import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { User } from 'src/app/models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
  user: User = {
    'email': 'francesca56@example.org',
    'password': 'secret'
  };
  returnUrl: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    document.body.className = 'my-login-page';
    this.returnUrl = this.activateRoute.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onLogin() {
    this.authService.login(this.user)
                    .pipe(first())
                    .subscribe(
                      data => {
                        this.router.navigate([this.returnUrl]);
                      },
                      error => {
                        console.log(error);
                      }
                    );
  }

  ngOnDestroy(): void {
    document.body.className = '';
  }

}
