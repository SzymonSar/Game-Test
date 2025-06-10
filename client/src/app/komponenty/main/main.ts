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
    
  }
  bazaurl = bazaurl;
  users: any[] = []
  user: string = "";
  username: string = "";
  px: number = 10.0;
  py: number = 10.0;
  color: string = "#00ff00"

  AxiosGet = async () => {
    let client = axios.create({
      baseURL: this.bazaurl
    });
    try {
      const response = await client.get(`/get-db/?owner=${this.user}&anti=1`);
      this.users = response.data
      console.log(response.data)
    } catch (error) {
      console.log("error", error);
    }
  }
  AxiosGetUser = async () => {
    let client = axios.create({
      baseURL: this.bazaurl
    });
    try {
      const response = await client.get(`/get-db/?owner=${this.user}`);
      this.px = response.data[0].px
      this.py = response.data[0].py
      this.color = response.data[0].color
      console.log("moje informacje "+response.data[0])
      console.log("zapisane "+this.px+this.py+this.color)
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
      color: this.color
    }
    try {
      console.log(dane)
      const response = await client.post(`/add-db/`, dane, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(response.status)
    } catch (error) {
      console.log("error", error);
    }
  }


  async goNext() {
    console.log('Przechodzę dalej z username:', this.username);
    this.user = this.username
    await this.AxiosGetUser()
    await this.AxiosPost()
    this.Loop()
  }

  async Loop() {
    while(true){
      this.AxiosGet()
      this.AxiosPost()
      await this.delay(100)
    }
  }

delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
pressedKeys: Set<string> = new Set();
step: number = 2.5;
animationFrameId: any;

@HostListener('window:keydown', ['$event'])
handleKeyDown(event: KeyboardEvent) {
  this.pressedKeys.add(event.key.toLowerCase());
  if (!this.animationFrameId) {
    this.animate();
    this.AxiosPost()
  }
}

@HostListener('window:keyup', ['$event'])
handleKeyUp(event: KeyboardEvent) {
  this.pressedKeys.delete(event.key.toLowerCase());
  if (this.pressedKeys.size === 0) {
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }
}

animate() {
  if (this.pressedKeys.has('w') && this.py > 10) {
    this.py -= this.step;
  }
  if (this.pressedKeys.has('s') && this.py < 500) {
    this.py += this.step;
  }
  if (this.pressedKeys.has('a') && this.px > 10) {
    this.px -= this.step;
  }
  if (this.pressedKeys.has('d') && this.px < 1000) {
    this.px += this.step;
  }
  

  this.animationFrameId = requestAnimationFrame(() => this.animate());
}



}
