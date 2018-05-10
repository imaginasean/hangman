import {Component, OnInit, OnDestroy} from '@angular/core';
import { NavController } from 'ionic-angular';
import {Subscription} from "rxjs";
import {Observable} from "rxjs/observable";
import { interval } from 'rxjs/observable/interval';
import { HostListener } from '@angular/core';
import "rxjs/add/observable/interval";
import "rxjs/add/operator/take";
import "rxjs/add/operator/map";
@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage implements OnInit, OnDestroy {

  private tick: number;
  private subscription: Subscription;
  public lettersChosen: string[];
  public gameTimer: Observable<number>;
  public secondsLeft:number = 10;
  public wordToGuess:string;
  public misses:number = 0;
  public maxMisses:number = 10;
  public lettersFound:number = 0;
  public pxPerMiss:number = 28;
  public pxPerLastMiss:number = 34;
  public secondsPerDrop:number = 10;
  public sickleTop:string = "50px";
  public ropeTop:string = "-675px";
  public ropeTopStart:number = -675;
  public isGameOver: boolean = true;
  public isWinner:boolean = false;
  public isLoser:boolean = false;
  public gameOverCss:string = "hidden";
  public gameOverWinnerCss:string = "hidden";
  public gameLettersUsed = '';

  private wordList:string[] = ['appending','apologize','assisting','backpedal','basically','branching',
          'airport','alchemy','citizen','deserts','emptier','magical',
          'canoe','ether','flood','minus','scoop','sonic'];

  public L1:string;
  public L2:string;
  public L3:string;
  public L4:string;
  public L5:string;
  public L6:string;
  public L7:string;
  public L8:string;
  public L9:string;

  public L1Revealed:boolean;
  public L2Revealed:boolean;
  public L3Revealed:boolean;
  public L4Revealed:boolean;
  public L5Revealed:boolean;
  public L6Revealed:boolean;
  public L7Revealed:boolean;
  public L8Revealed:boolean;
  public L9Revealed:boolean;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isGameOver)
      return;
    var aThruZ = /[a-zA-Z]/;
    console.log(event.key);
    console.log(aThruZ.exec(event.key));
    if (aThruZ.exec(event.key) != null)
      this.processLetter(event.key);
  }

  constructor(public navCtrl: NavController) {

  }
  ngOnInit() {
    this.gameTimer =  interval(1000)
    .map(tick => this.secondsPerDrop - tick);

    this.setupGame();
  }

  startTimer() {
    this.subscription = this.gameTimer.subscribe(t => {
      this.secondsLeft = t;
      if (this.secondsLeft == 0)
      {
        this.stopTimer();
        this.timerExpired();
      }
    });
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  stopTimer() {
    this.subscription.unsubscribe();
  }

  setupGame() {
    this.wordToGuess = this.pickWord();
    this.lettersChosen = [];
    this.misses = 0;
    this.secondsLeft = this.secondsPerDrop;
    this.L1 = "&nbsp;";
    this.L2 = "&nbsp;";
    this.L3 = "&nbsp;";
    this.L4 = "&nbsp;";
    this.L5 = "&nbsp;";
    this.L6 = "&nbsp;";
    this.L7 = "&nbsp;";
    this.L8 = "&nbsp;";
    this.L9 = "&nbsp;";

    this.L1Revealed = false;;
    this.L2Revealed = false;;
    this.L3Revealed = false;;
    this.L4Revealed = false;;
    this.L5Revealed = false;;
    this.L6Revealed = false;;
    this.L7Revealed = false;;
    this.L8Revealed = false;;
    this.L9Revealed = false;;
    this.lettersFound = 0;
    this.isGameOver = false;
    this.gameOverWinnerCss = "hidden";
    this.isWinner = false;
    this.isLoser= false;
    this.gameOverCss = "hidden";
    this.sickleTop = "50px";
    this.ropeTop = this.ropeTopStart + "px"
    this.startTimer();
    this.gameLettersUsed = '';
  }

  pickWord() {
    return this.wordList[Math.floor((Math.random() * this.wordList.length))];
  }

  processLetter(letter) {
    var foundLetter = false;

    if (this.lettersChosen.indexOf(letter)>-1)
      return; // already used

    this.gameLettersUsed  = this.gameLettersUsed == '' ? letter : (this.gameLettersUsed + " " + letter);

    for (var a=[],i=this.wordToGuess.length;i--;) {
      if (this.wordToGuess[i]==letter) {
        this['L' + ((i+1)+ (Math.floor((9-this.wordToGuess.length)/2))).toString()] = letter;
        this.lettersFound++;
        foundLetter = true;
      }
    }

    this.lettersChosen.push(letter);
    if (foundLetter)
      this.resetTimer();
    else
      this.markMiss();
    this.checkForGameOver();
  };

  resetTimer() {
    this.stopTimer();
    this.startTimer();
  }

  timerExpired() {
    this.markMiss();
    if (!this.isGameOver)
      this.startTimer();
  }

  markMiss() {
    //check for game over condition, if not, start timer again
    this.misses++;
    this.sickleTop = (50 + ((this.misses == this.maxMisses ?  this.pxPerLastMiss : this.pxPerMiss) * this.misses)) + "px";
    this.ropeTop = (this.ropeTopStart + ((this.misses == this.maxMisses ?  this.pxPerLastMiss : this.pxPerMiss) * this.misses)) + "px";
    this.checkForGameOver();
  }

  checkForGameOver() {
    if (this.misses>= this.maxMisses ||  this.lettersFound == this.wordToGuess.length)
    {
      if (this.misses>= this.maxMisses)
      {
        this.isLoser = true;
        this.gameOverCss = "visible";
        this.showRemainingLetters();
      }
      else
      {
        this.gameOverWinnerCss = "visible";
        this.isWinner = true;
      }
      this.isGameOver = true;
      this.stopTimer();
    }
  }

  showRemainingLetters() {
    for (var i=0; i<this.wordToGuess.length;i++) {
      var letterAddress = 'L' + ((i+1)+ (Math.floor((9-this.wordToGuess.length)/2))).toString();
      if (this[letterAddress]  == '&nbsp;')
      {
        this[letterAddress]  =  this.wordToGuess[i];
        this[letterAddress+'Revealed']  =  true;
      }
    }
  }

  public toggle(event) {

  }
}
