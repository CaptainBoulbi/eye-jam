import inventaire from "./inventaire.ts"

export class Game {
    private inv = inventaire

    public getInventaire() {
        return this.inv
    }
}