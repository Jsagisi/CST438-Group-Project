
export interface User {
  uid:string;
  displayName:string;
  email:string;
  phoneNumber:string;
  photoUrl:string;
}
export class UserModel implements User{

  constructor(
    public uid:string,
    public displayName:string,
    public email:string,
    public phoneNumber:string,
    public photoURL:string){

  }


}
