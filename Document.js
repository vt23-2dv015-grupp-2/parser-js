export class Document {
    constructor(name, words) {
        this.name = name
        this.words = words
    }

    getWords () {
        return this.words
    }
    
    getNumberOfWords () {
        return this.words.length
    }
}