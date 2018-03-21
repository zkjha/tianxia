import { Component, OnInit, Input, Output, OnChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.less']
})
export class PaginationComponent implements OnInit, OnChanges {
    
    constructor() {
    }
    
    @Input() pageCount = 5;
    
    @Input() totalCount = 0;
    
    @Input() pageSize = 10;
    
    @Input() currentPage = 1;
    
    @Input() changePage = 10;
    
    @Output() changeCurrentPage: EventEmitter<Object> = new EventEmitter;
    
    @Output() changePageSize: EventEmitter<Object> = new EventEmitter;
    
    prevPage(pageNo) {
        if (this.currentPage === 1 ) {
           return false;
        }
        this.currentPage = pageNo;
        const cPages = this.currentPage;
        const pSize = this.pageSize;
        this.changeCurrentPage.emit({currentPage: cPages, pageSize: pSize});
    }
    nextPage(pageNo) {
        if (this.currentPage === this.pageCount || this.pageCount === 0) {
            return false;
        }
        this.currentPage = pageNo;
        const cPages = this.currentPage;
        const pSize = this.pageSize;
        this.changeCurrentPage.emit({currentPage: cPages, pageSize: pSize});
    }
    
    changeOption(event) {
        this.pageSize = event.target.value;
        const cPages = this.currentPage;
        const pSize = this.pageSize;
        this.changeCurrentPage.emit({currentPage: cPages, pageSize: pSize});
    }
    ngOnInit() {
    }
    
    ngOnChanges() {
        this.currentPage = 1;
        this.pageSize = this.changePage;
    }
    
}
