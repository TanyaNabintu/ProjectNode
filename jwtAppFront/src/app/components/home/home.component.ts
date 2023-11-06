import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from 'src/app/emitters/emitter';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authenticated = false
  message= ""
  name = ""
  email = ""

  posts: any[];

  form:FormGroup
  form1:FormGroup

  constructor(private http:HttpClient, private formBuilder: FormBuilder, private router: Router){}

  ngOnInit():void{

    Emitters.authEmitter.subscribe((auth:boolean) =>{
      this.authenticated = auth
    })
    this.http.get('http://localhost:5000/api/user',{
      withCredentials: true
    })
    .subscribe((res:any) =>{
      this.message = `Hi ${res.name}`
      this.name = res.name
      this.email = res.email

      this.form = this.formBuilder.group({
        title: "",
        description:"",
        author: res.email
      })

      Emitters.authEmitter.emit(true)
    },
    (err) => {
      this.message = "Welcome"
      Emitters.authEmitter.emit(false)
    })

    this.http.get<string[]>('http://localhost:5000/api/getPosts').subscribe((data: any[]) =>{
      this.posts = data
    })
    
  }
  submit(): void{
      let post = this.form.getRawValue()

      if(post.title == "" || post.description == ""){
        Swal.fire("Error", "Please enter all the fields", "error")
      }else{
        this.http.post("http://localhost:5000/api/addPost", post, {
          withCredentials: true
        })
        .subscribe(() => this.router.navigate(['/']), (err) =>{
          Swal.fire("Error", err.error.message, "error")
        })
        window.location.reload();
      }
      
  }
  deletePost(postId: string): void{
    this.http.delete(`http://localhost:5000/api/deletePost/${postId}`).subscribe((res:any)=>{
      if (res) {
        Swal.fire("Success", "Post deleted successfully");
        window.location.reload();
      }else{
        Swal.fire("Error", "Error deleting post", "error")
      }
    },(err) =>{Swal.fire("Error", err.error.message, "error")}
    )
  }

}
