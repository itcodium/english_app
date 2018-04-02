export class Phrase {
  _id: Object;
  us : string;
  es : string;
  meaning : string;
  show:boolean;
}


export class Category {
  _id: Object;
  name : string;
}

export class User {
  _id: Object;
  name : string;
  email  : string;
  password : string;
  status : string;
}
