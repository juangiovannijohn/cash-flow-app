import { Component, OnInit } from '@angular/core';
import { Plans } from 'src/app/core/models-interface/interfaces';
import { SupabaseService } from 'src/app/core/shared/services/supabase.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {
plans : Plans[] =[]
  constructor(private readonly supabase: SupabaseService) { }

  ngOnInit(): void {
    this.getPlans();
  }

  getPlans(){
    this.supabase.getPlans().then(resp=>{
      if(!resp.error && resp.plans ){
      const plans = resp.plans.map(plan =>{
       plan.plan_items = JSON.parse(plan.plan_items);
       return plan;
      })
      plans.sort((a,b)=>a.plan_order - b.plan_order)
      this.plans = plans
      }
    })
  }
}
