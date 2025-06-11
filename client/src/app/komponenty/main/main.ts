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
  userhalfsize = 5;
  blockhalfsize = 5;
  px: number = 10.0;
  py: number = 10.0;
  color: string = "#00ff00"
  blocks: any[] = []
AxiosGetUsers = async () => {
  let client = axios.create({
    baseURL: this.bazaurl
  });
  try {
    const response = await client.get(`/get-users-db/?owner=${this.user}&anti=1`);
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
    const response = await client.get(`/get-users-db/?owner=${this.user}`);
    this.px = response.data[0].px
    this.py = response.data[0].py
    this.color = response.data[0].color
    console.log("moje informacje "+response.data[0])
    console.log("zapisane "+this.px+this.py+this.color)
  } catch (error) {
    console.log("error", error);
  }
}

AxiosPostUser = async () => {
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
    const response = await client.post(`/add-users-db/`, dane, {
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
  await this.AxiosPostUser()
  this.Loop()
}

async Loop() {
  while(true){
    await this.AxiosGetUsers()
    await this.AxiosPostUser()
    await this.AxiosGetBlocks()
    await this.delay(10)
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
    this.AxiosPostUser()
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
  let newPx = this.px;
  let newPy = this.py;

  if (this.pressedKeys.has('w')) {
    newPy -= this.step;
  }
  if (this.pressedKeys.has('s')) {
    newPy += this.step;
  }
  if (this.pressedKeys.has('a')) {
    newPx -= this.step;
  }
  if (this.pressedKeys.has('d')) {
    newPx += this.step;
  }

  if (!this.isCollision(newPx, newPy)) {
    if (newPx >= 10 && newPx <= 1000) this.px = newPx;
    if (newPy >= 10 && newPy <= 500) this.py = newPy;
  }

  this.animationFrameId = requestAnimationFrame(() => this.animate());
}


AxiosGetBlocks = async () => {
  let client = axios.create({
    baseURL: this.bazaurl
  });
  try {
    const response = await client.get(`/get-blocks-db`);
    this.blocks = response.data
    console.log(response.data)
  } catch (error) {
    console.log("error", error);
  }
}

  blockpx: number = 10.0;
  blockpy: number = 10.0;
  blockcolor: string = "#dd0000"

AxiosPostBlock = async () => {
  let client = axios.create({
    baseURL: this.bazaurl
  });
  const dane = {
    px: this.blockpx,
    py: this.blockpy,
    color: this.blockcolor
  }
  try {
    console.log(dane)
    const response = await client.post(`/add-blocks-db/`, dane, {
    headers: { 'Content-Type': 'application/json' }
  });
  console.log(response.status)
  } catch (error) {
    console.log("error", error);
  }
}


@HostListener('document:click', ['$event'])
handleMouseClick(event: MouseEvent) {
  const x = event.clientX;
  const y = event.clientY;
  this.blockpx = Math.round((x - this.blockhalfsize)/5)*5
  this.blockpy = Math.round((y - this.blockhalfsize)/5)*5
  this.AxiosPostBlock();
}


isCollision(x: number, y: number): boolean {
  
  for (const block of this.blocks) {
    const blockLeft = block.px - this.blockhalfsize;
    const blockRight = block.px + this.blockhalfsize;
    const blockTop = block.py - this.blockhalfsize;
    const blockBottom = block.py + this.blockhalfsize;

    if (
      x + this.userhalfsize > blockLeft &&
      x - this.userhalfsize < blockRight &&
      y + this.userhalfsize > blockTop &&
      y - this.userhalfsize < blockBottom
    ) {
      return true; 
    }
  }
  return false;
}




}
