import { Component, OnInit , EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert-message-modal',
  templateUrl: './alert-message-modal.component.html',
  styleUrls: ['./alert-message-modal.component.css']
})
export class AlertMessageModalComponent implements OnInit {
  @Input() message: string = '';
  @Output() close = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }
  confirm() {
    this.close.emit();
  }

}
