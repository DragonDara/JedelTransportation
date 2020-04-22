import { User } from '../auth/user.model';

export class Product {
  public productid: number;
  public productname: string;
  public weight: number;
  public volume: number;
  public cost: number;
  public description: string;
  public producttype: string;
  public images:any[];
  public user: User;

  constructor(productname: string, weight: number, volume: number, cost: number, description: string, images: any[], user: User, producttype: string, productid: number) {
    this.productid = productid;
    this.productname = productname;
    this.weight = weight;
    this.volume = volume;
    this.cost = cost;
    this.description = description;
    this.images = images;
    this.user = user;
    this.producttype = producttype;
  }
}
