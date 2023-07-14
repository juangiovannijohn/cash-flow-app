import { Component, OnInit, EventEmitter, Output, Input  } from '@angular/core';

@Component({
  selector: 'app-confirm-delete-category',
  templateUrl: './confirm-delete-category.component.html',
  styleUrls: ['./confirm-delete-category.component.css']
})
export class ConfirmDeleteCategoryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input() message: string = '';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm() {
    this.confirmed.emit();
  }

  cancel() {
    this.cancelled.emit();
  }
}
