import { User } from '../auth/user.model';

export class Product {
  public productid: number;
  public productname: string;
  public weight: number;
  public volume: number;
  public cost: number;
  public currency: string;
  public description: string;
  public producttype: string;
  public respondedcount?: number
  public images?:any[];
  public user: User;
  public userid: User;
  public whereto: string;
  public wherefrom: string;
  public when: Date

  constructor(productname: string, weight: number, volume: number, cost: number, description: string, images: any[], user: User, producttype: string, productid: number,userid:User, currency:string, when: Date,wherefrom:string, respondedcount?: number) {
    this.productid = productid;
    this.productname = productname;
    this.weight = weight;
    this.volume = volume;
    this.cost = cost;
    this.description = description;
    this.images = images;
    this.user = user;
    this.producttype = producttype;
    this.respondedcount = respondedcount;
    this.userid = userid;
    this.currency = currency;
    this.when = when;
    this.wherefrom = wherefrom;
    this.whereto = this.whereto;
  }
}
