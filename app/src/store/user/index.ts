import { User } from './types';

export class UserStore implements User {
  id = '';
  name = '';

  set(user: User) {
    this.id = user.id;
    this.name = user.name;
  }

  clear() {
    this.id = '';
    this.name = '';
  }

  get isLoggedIn() {
    return this.id !== '';
  }

  get isLoggedOut() {
    return !this.isLoggedIn;
  }
}
