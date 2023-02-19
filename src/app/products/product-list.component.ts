import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IProduct } from "./product";
import { ProductService } from "./product.service";

@Component({
    templateUrl: './product-list.component.html',
    styleUrls:['./product-list.component.css']
})
export class ProductListComponent  implements OnInit, OnDestroy{
    pageTitle:string = "Product List";
    imageWidth:number = 50;
    imageMargin:number = 2;
    showImage:boolean = false;
    private _listFilter : string = '';
    filteredProducts:IProduct[] = [];
    private _productService:ProductService;
    errorMessage: string = '';
    sub! : Subscription;

    get listFilter() : string{
        return this._listFilter;
    }

    set listFilter(value:string){
        this._listFilter = value;
        this.filteredProducts = this.performFilter(this._listFilter);
    }
    products: IProduct[] = [];

    constructor(private productService : ProductService){
        this._productService = productService;
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    ngOnInit(): void {
        this.sub = this._productService.getProducts().subscribe({
            next: products => {
                this.products = products;
                this.filteredProducts = this.products;
            },
            error: err => this.errorMessage = err
        });

    }

    toggleImage() : void{
        this.showImage = ! this.showImage;
    }

    performFilter(filterBy:string) : IProduct[]{
        filterBy = filterBy.toLocaleLowerCase();
        return this.products.filter((product:IProduct) => product.productName.toLocaleLowerCase().includes(filterBy));
    }

    onRatingClicked(message : string) : void{
        this.pageTitle = "Product List "+message;
    }
}