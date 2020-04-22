export class User{
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date
    ) { 

    }

    get token() {
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
            return null;
        }
        return this._token;
    }
}



export class UserInfo{
    constructor(
        public email: string,
        public surname: string,
        public name: string,
        public phone: string,
        public image: string,
        public id: string,
      
    ) { 

        this.email = email;
        this.surname = surname;
        this.name = name;
        this.phone = phone;
        this.image = image;
        this.id = id;
    }
}

