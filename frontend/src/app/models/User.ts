import UserInfo = firebase.UserInfo

export  interface User {
  uid:string;
  displayName:string;
  email:string;
  phoneNumber:string;
  photoURL:string;
}
export class UserModel implements User{

  constructor(
    public uid:string,
    public displayName:string,
    public email:string,
    public phoneNumber:string,
    public photoURL:string){

  }

  static nullUser(){
    //We should be able to optimize this, but it's not super important right now
    return new this(" "," "," "," "," ")
  }
  static fromFirebaseUser(userInfo:UserInfo) {
    console.log(userInfo);
    return new this(userInfo.uid,userInfo.displayName,userInfo.displayName,userInfo.phoneNumber,userInfo.photoURL)
  }


}
