import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Component,  HostListener, OnInit } from '@angular/core';
import axios from 'axios';
import { bazaurl } from '../../app.config';
@Component({
  selector: 'app-main',
  imports: [CommonModule, FormsModule],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main implements OnInit{
  ngOnInit(): void {
    this.AxiosGet();
  }
  bazaurl = bazaurl;
  danein: any[] = []
  user: string = "";
  px: number = 0.0;
  py: number = 0.0;
  rot: number = 0.0;
  color: string = "#000000"

  AxiosGet = async () => {
    let client = axios.create({
      baseURL: this.bazaurl
    });
    try {
      const response = await client.get(`/get-db/`);
      this.danein = response.data
      console.log(response.data)
    } catch (error) {
      console.log("error", error);
    }
  }

  AxiosPost = async () => {
    let client = axios.create({
      baseURL: this.bazaurl
    });
    const dane = {
      owner: this.user,
      px: this.px,
      py: this.py,
      rot: this.rot
    }
    try {
      console.log(dane)
      const response = await client.post(`/add-db`, dane, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(response.status)
    } catch (error) {
      console.log("error", error);
    }
  }

  async Dodaj(){
    console.log("dodaj dodaje")
    if(this.user != "" && this.px != 0.0 && this.py != 0.0)
      {
      await this.AxiosPost()
    }
    this.AxiosGet()
  }

step: number = 10.0  
@HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key.toLowerCase()) {
      case 'w':
        this.py -= this.step;
        break;
      case 's':
        this.py += this.step;
        break;
      case 'a':
        this.px -= this.step;
        break;
      case 'd':
        this.px += this.step;
        break;
    }
}

}
