/**
 * BM25 ranking algorithm for text search
 * Ported from Python core.py
 */

class BM25 {
  constructor(k1 = 1.5, b = 0.75) {
    this.k1 = k1;
    this.b = b;
    this.corpus = [];
    this.docLengths = [];
    this.avgdl = 0;
    this.idf = {};
    this.docFreqs = {};
    this.N = 0;
  }

  /**
   * Tokenize text: lowercase, remove punctuation, filter short words
   * @param {string} text
   * @returns {string[]}
   */
  tokenize(text) {
    const cleaned = String(text).toLowerCase().replace(/[^\w\s]/g, ' ');
    return cleaned.split(/\s+/).filter(word => word.length > 2);
  }

  /**
   * Build BM25 index from documents
   * @param {string[]} documents
   */
  fit(documents) {
    this.corpus = documents.map(doc => this.tokenize(doc));
    this.N = this.corpus.length;

    if (this.N === 0) return;

    this.docLengths = this.corpus.map(doc => doc.length);
    this.avgdl = this.docLengths.reduce((a, b) => a + b, 0) / this.N;

    this.corpus.forEach(doc => {
      const seen = new Set();
      doc.forEach(word => {
        if (!seen.has(word)) {
          this.docFreqs[word] = (this.docFreqs[word] || 0) + 1;
          seen.add(word);
        }
      });
    });

    for (const [word, freq] of Object.entries(this.docFreqs)) {
      this.idf[word] = Math.log((this.N - freq + 0.5) / (freq + 0.5) + 1);
    }
  }

  /**
   * Score all documents against query
   * @param {string} query
   * @returns {Array<[number, number]>} Array of [docIndex, score] sorted by score desc
   */
  score(query) {
    const queryTokens = this.tokenize(query);
    const scores = [];

    this.corpus.forEach((doc, idx) => {
      let score = 0;
      const docLen = this.docLengths[idx];
      
      const termFreqs = {};
      doc.forEach(word => {
        termFreqs[word] = (termFreqs[word] || 0) + 1;
      });

      queryTokens.forEach(token => {
        if (this.idf[token] !== undefined) {
          const tf = termFreqs[token] || 0;
          const idf = this.idf[token];
          const numerator = tf * (this.k1 + 1);
          const denominator = tf + this.k1 * (1 - this.b + this.b * docLen / this.avgdl);
          score += idf * numerator / denominator;
        }
      });

      scores.push([idx, score]);
    });

    return scores.sort((a, b) => b[1] - a[1]);
  }
}

module.exports = BM25;
