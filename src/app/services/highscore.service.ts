import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Highscore } from "../interfaces/highscore.interface";
import { Observable } from "rxjs";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class HighscoreService {

    public httpOptions: {
        headers?: HttpHeaders;
    };

    maxNumHighscores = 20;
    highscores: Highscore[];
    yourHighscore: number;

    apiUrl = environment.apiUrl + '/grid-game';

    constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
        this.httpOptions = {};
        this.yourHighscore = localStorageService.getLocalStorageItem('highscore');
    }

    getHighscoresApi() {
        return this.http.get<Highscore[]>(`${this.apiUrl}/highscores`);
    }


    getHighscores(): Observable<Highscore[]> {
        return new Observable(obs => {
            // if (this.highscores != undefined) {
            //     obs.next(this.highscores);
            // }

            this.getHighscoresApi().subscribe(resp => {
                this.highscores = resp;
                obs.next(this.highscores);
            })
        })
    }

    checkIfYourHighscore(score) {
        if (score > this.yourHighscore) {
            this.yourHighscore = score;
            this.localStorageService.setLocalStorageItem('highscore', score);
        }
    }

    addHighScore(score: {score: number, name: string}) {
        console.log('hello')
        return this.http.post<Highscore[]>(`${this.apiUrl}/highscore`, score);
    }

    checkIfHighscore(score): boolean {
        console.log(this.highscores)
        if (this.highscores.length < this.maxNumHighscores) {
            return true;
        }

        if (score > this.highscores[this.highscores.length - 1].score) {
            return true;
        }

        return false;
    }
}