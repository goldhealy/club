import { Component, OnInit } from '@angular/core';
import { TableFilterService } from '../../table-filter.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { nameValueDictionaryFromObject } from 'src/app/create-new-event/create-new-event.component';

export interface Selector {
  value: string;
  name: string;
}

@Component({
  selector: 'event-filter',
  templateUrl: './event-filter.component.html',
  styleUrls: ['./event-filter.component.css']
})
export class EventFilterComponent implements OnInit {

  public slider1Val: Number = 100;
  public kidsAllowed: boolean = false;

  public options: Selector[];

  public categories: Selector[];

  public childrenOptions: Selector[];

  childrenForm = new FormGroup({
    selection: new FormControl('')
  });
  categoryForm = new FormGroup({
    selection: new FormControl('')
  });
  genderForm = new FormGroup({
    selection: new FormControl('')
  });

  constructor(
    private tbs: TableFilterService,
    private translateService: TranslateService,
    ) { }

  ngOnInit() {
    this.translateService.get("COMPONENTS.NEW_EVENT.AUDIENCE_STEP.CHILDREN_OPTIONS").subscribe(values => {
      this.childrenOptions = nameValueDictionaryFromObject(values);
      this.childrenOptions.unshift({ value: '', name: 'Alle' })
    });
    
    this.translateService.get("COMPONENTS.NEW_EVENT.AUDIENCE_STEP.GENDER_OPTIONS").subscribe(values => {
      this.options = nameValueDictionaryFromObject(values);
      this.options.unshift({ value: '', name: 'Alle' })
    });
    
    this.translateService.get("COMPONENTS.NEW_EVENT.WHAT_AND_WHERE_STEP.CATEGORIES").subscribe(values => {
      this.categories = nameValueDictionaryFromObject(values);
      this.categories.unshift({ value: '', name: 'Alle' })
    });

  }

  onDistanceChange() {
    if (this.slider1Val != 0) {
      this.tbs.onDistanceChange(this.slider1Val);
    }
  }

  onChildrenChange(value) {
    if (value != undefined) {
      this.tbs.onChildrenChange(value);
    }
  }

  onOptionChange(value) {
    if (value != undefined) {
      this.tbs.onGenderChange(value);
    }
  }

  onCategoryChange(value) {
    this.tbs.onCategoryChange(value);
  }


  clear() {
    this.tbs.clearFilters();
    this.categoryForm.get('selection').setValue('');
    this.childrenForm.get('selection').setValue('');
    this.genderForm.get('selection').setValue('');
    this.slider1Val = 100;
  }

}
