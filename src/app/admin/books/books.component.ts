import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/model/Category';
import { Book } from '../../model/Book';
import { HttpClientService } from '../../service/http-client.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit {
  books: Array<Book>;
  booksRecieved: Array<Book>;
  selectedBook: Book;
  action: string;
 
  constructor(
    private httpClientService: HttpClientService,
    private activedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.httpClientService
      .getBooks()
      .subscribe((response) => this.handleSuccessfulResponse(response));
    this.activedRoute.queryParams.subscribe((params) => {
      this.action = params['action'];
      const id = params['id'];   
      if (id) {
        this.selectedBook = this.books.find((book) => {
          return book.id === +id;
        });
      }
    });
 
  }

  handleSuccessfulResponse(response) {
    this.books = new Array<Book>();
    this.booksRecieved = response;
    for (const book of this.booksRecieved) {
      const bookwithRetrievedImageField = new Book();
      bookwithRetrievedImageField.id = book.id;
      bookwithRetrievedImageField.name = book.name;
      bookwithRetrievedImageField.retrievedImage =
        'data:image/jpeg;base64,' + book.picByte;
      bookwithRetrievedImageField.author = book.author;
      bookwithRetrievedImageField.price = book.price;
      bookwithRetrievedImageField.category_id = book.category_id;
      bookwithRetrievedImageField.picByte = book.picByte;
      this.books.push(bookwithRetrievedImageField);
    }
  }

  addBook() {
    this.selectedBook = new Book();
    this.router.navigate(['admin', 'books'], {
      queryParams: { action: 'add' },
    });
  }

  viewBook(id: number) {
    this.router.navigate(['admin', 'books'], {
      queryParams: { id, action: 'view' },
    });
  }
}
