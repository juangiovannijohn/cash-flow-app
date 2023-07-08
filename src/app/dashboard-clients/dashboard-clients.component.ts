import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard-clients',
  templateUrl: './dashboard-clients.component.html',
  styleUrls: ['./dashboard-clients.component.css']
})
export class DashboardClientsComponent implements OnInit {
  open = false;


  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.navigate(['perfil'], { relativeTo: this.route });
  }
  toggleMenu() {
    this.open = !this.open;
  }

}
