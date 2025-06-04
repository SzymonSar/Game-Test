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
  danein: any[] = []
  user: string = "";
  username: string = "";
  px: number = 0.0;
  py: number = 0.0;
  color: string = "#00ff00"

  AxiosGet = async () => {
    let client = axios.create({
      baseURL: this.bazaurl
    });
    try {
      const response = await client.get(`/get-db/?owner=${this.user}`);
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

  async Dodaj(){
    console.log("dodaj dodaje")
    if(this.user != "" && this.px != 0.0 && this.py != 0.0)
      {
      await this.AxiosPost()
    }
    this.AxiosGet()
  }

  

  goNext() {
    console.log('Przechodzę dalej z username:', this.username);
    this.user = this.username
    this.AxiosPost()
    this.Loop()
  }

  async Loop() {
    while(true){
      this.AxiosGet()
      this.AxiosPost()

    }
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
  if (this.pressedKeys.has('w')) {
    this.py -= this.step;
  }
  if (this.pressedKeys.has('s')) {
    this.py += this.step;
  }
  if (this.pressedKeys.has('a')) {
    this.px -= this.step;
  }
  if (this.pressedKeys.has('d')) {
    this.px += this.step;
  }
  

  this.animationFrameId = requestAnimationFrame(() => this.animate());
}



}
