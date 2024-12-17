import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  users: any = [];
  loginUser: any = {};
  val1: boolean = true;
  val2: boolean = false;
  val3: boolean = false;
  allStudents: any = [];
  p: number = 1;
  collection: any[] = [];
  formData: any = {};
  editItem: any;
  constructor(
    private route: Router,
    public auth: AuthService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.auth.getLoginUserDetails().subscribe(
      (res) => {
           localStorage.setItem('myLSkey', JSON.stringify(res));
      },
      (err) => console.log('login user can not accesible')
    );
    this.api.getAllUsers().subscribe((res) => {
      (this.allStudents = res),console.log(res), (this.collection = res.length);
    });

  }
  ngDoCheck() {
    if(this.auth.isLoggedIn()){
      this.loginUser = JSON.parse(localStorage.getItem('myLSkey') || '{}');
      console.log(this.loginUser)
    }
  }

  signOut() {
    this.auth.signOut();
  }

  Class() {
    this.val1 = true;
    this.val2 = false;
    this.val3 = false;
  }
  lab() {
    this.val1 = false;
    this.val2 = true;
    this.val3 = false;
  }
  Excilence() {
    this.val1 = false;
    this.val2 = false;
    this.val3 = true;
  }

  details(std: any) {
    console.log(std);
    this.loginUser = std;
  }

  edit(id: any) {
    this.editItem = id;
    this.api.getResult(id).subscribe(
      (res) => ((this.formData = res), console.log(this.formData)),
      (err) => console.log('something wrong')
    );
  }

  onSubmit(val: any) {
    debugger;
    this.api.updateData(val).subscribe(
      (res) => {
        alert('Updated succesfully');
      },
      (err) => console.log(err)
    );
  }

  reset() {
    this.formData = {};
  }

  registration(){
    this.route.navigate(['/registration'])
  }
  notice(){
    this.route.navigate(['/notice'])
  }
  result(){
    this.route.navigate(['/upload-result'])
  }

  downloadPDF() {
    debugger
    const doc = new jsPDF.default();

    const header = [['ID', 'Name', 'Gender','DOB','Email', 'Phone Number']];

    // Prepare data rows
    const data = this.allStudents.map((product: any) => [product.id, product.fullName, product.gender, product.dob,product.email,product.phoneNumber]);


    // @ts-ignore
    doc.autoTable({
      head: header,
      body: data
    });

    doc.save('Student-List.pdf');
  }
}
