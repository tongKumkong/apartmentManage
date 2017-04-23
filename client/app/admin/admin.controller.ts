'use strict';

export default class AdminController {
  users: Object[];
  readers: Object[];
  $http
  newReader;
  /*@ngInject*/
  constructor(User,$http) {
    // Use the User $resource to fetch all users
    this.$http = $http;
    this.users = User.query();
    this.$http.get('api/readers').then(res => {
      this.readers = res.data;
    });
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }

  addReader(reader) {
    this.$http.post('api/readers',{
      barcode: this.newReader
    });
    this.$http.get('api/readers').then(res => {
      this.readers = res.data;
    });
  }
}
