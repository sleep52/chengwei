const GameState = {
  _key: 'tide_state',
  _defaults: {
    visitCount: 0,
    pagesVisited: [],
    currentAct: 1,
    puzzleProgress: {},
    chatProgress: 0,
    choices: {},
    firstVisit: null,
    lastVisit: null,
    totalPlayTime: 0,
    sessionStart: null,
    hiddenCluesFound: [],
    diaryRevealed: false,
    photoClicked: [],
    memoryVisits: 0,
    usedSocialLogin: false,
    decodedMessages: [],
    finalChoice: null,
    observerPath: false,
    timeline: []
  },

  init() {
    const saved = localStorage.getItem(this._key);
    if (saved) {
      this._state = { ...this._defaults, ...JSON.parse(saved) };
    } else {
      this._state = { ...this._defaults };
      this._state.firstVisit = Date.now();
    }
    this._state.sessionStart = Date.now();
    this._state.visitCount++;
    this._state.lastVisit = Date.now();
    this.save();
    this._startTimer();
  },

  _startTimer() {
    setInterval(() => {
      if (this._state.sessionStart) {
        this._state.totalPlayTime = Math.floor(
          (Date.now() - this._state.sessionStart) / 1000
        ) + (this._state.totalPlayTime || 0);
        this.save();
      }
    }, 60000);
  },

  get(key) {
    return this._state[key];
  },

  set(key, value) {
    this._state[key] = value;
    this.save();
  },

  recordPageVisit(pageId) {
    if (!this._state.pagesVisited.includes(pageId)) {
      this._state.pagesVisited.push(pageId);
    }
    this._state.timeline.push({
      type: 'page_visit',
      page: pageId,
      time: Date.now()
    });
    this.save();
  },

  recordChoice(choiceId, value) {
    this._state.choices[choiceId] = value;
    this._state.timeline.push({
      type: 'choice',
      id: choiceId,
      value: value,
      time: Date.now()
    });
    this.save();
  },

  recordClue(clueId) {
    if (!this._state.hiddenCluesFound.includes(clueId)) {
      this._state.hiddenCluesFound.push(clueId);
      this._state.timeline.push({
        type: 'clue',
        id: clueId,
        time: Date.now()
      });
    }
    this.save();
  },

  recordDecode(messageId) {
    if (!this._state.decodedMessages.includes(messageId)) {
      this._state.decodedMessages.push(messageId);
    }
    this.save();
  },

  getStats() {
    return {
      pagesVisited: this._state.pagesVisited.length,
      visitCount: this._state.visitCount,
      cluesFound: this._state.hiddenCluesFound.length,
      choices: Object.keys(this._state.choices).length,
      totalPlayTime: this._state.totalPlayTime,
      timeline: this._state.timeline
    };
  },

  isPageVisited(pageId) {
    return this._state.pagesVisited.includes(pageId);
  },

  reset() {
    localStorage.removeItem(this._key);
    this._state = { ...this._defaults };
    this._state.firstVisit = Date.now();
    this.save();
  },

  save() {
    localStorage.setItem(this._key, JSON.stringify(this._state));
  }
};

GameState.init();
