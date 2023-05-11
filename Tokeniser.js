import fs from 'fs'
import path from 'path'
import JSZip from 'jszip'
import { DOMParser } from 'xmldom'
import { Document } from './Document.js'

export class Tokeniser {
    constructor(paths) {
        this.paths = paths
        this.documents = []
        this.parseDocuments(paths)
    }

    async getDocuments() {
        if (this.documents.length > 0) {
            return this.documents
        }
        await this.parseDocuments(this.paths)
        return this.documents
    }

    async parseDocuments(paths) {
        const promises = paths.map(filePath => {
            const documentName = path.basename(filePath)
            return this.parseDocx(filePath)
                .then(words => {
                    const document = new Document(documentName, words)
                    this.documents.push(document)
                })
        })

        await Promise.all(promises)    
    }

    async parseDocx(filePath) {
        const zip = new JSZip()
        const content = await fs.promises.readFile(filePath)
        const doc = await zip.loadAsync(content)
        const xmlContent = await doc.file('word/document.xml').async('text')
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml')
        const paragraphs = xmlDoc.getElementsByTagName('w:p')
        const texts = []
        for (let i = 0; i < paragraphs.length; i++) {
          const textNodes = paragraphs[i].getElementsByTagName('w:t')
          let text = ''
          for (let j = 0; j < textNodes.length; j++) {
            text += textNodes[j].textContent
          }
          texts.push(text)
        }
        return this.trimText(texts)
    }

    async trimText(texts) {
        const words = []
        texts.forEach(text => {
            const trimmedText = text.trim().replaceAll(/-/g, '')
            if (trimmedText !== '') {
                const textWords = trimmedText.split(/\s+/)
                words.push(...textWords)
            }
        })
        return words.flat()
    }
    
}
