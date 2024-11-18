const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const nextSong = $('.fa-forward')
const backSong = $('.music__control-icon--back')
const random = $('.fa-shuffle')
const lMode = $('.fa-sun')
const dMode = $('.fa-moon')
const repeatBtn = $('.fa-rotate-right')
const playList = $('.music__playlist')
const main = $('main')
const musicDashboard = $('.music__dashboard')
const icon = $('.play__icon')
const playListItem = $('.playlist__item')
const musicPlaylist = $('.music__playlist')

const app = {
    CurrentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    settings: {},
    songs: [  
        {
            name: 'Nevada',
            singer: 'Vicetone',
            music: './assets/music/music1.mp3',
            image: './assets/img/nevada.png'
        },
        
        {
            name: 'That Girl x Talking To The Moon',
            singer: 'Olly Murs',
            music: './assets/music/music2.mp3',
            image: './assets/img/thatgirl.png'
        },
        {
            name: '赤伶',
            singer: 'DJ名龙 Remix',
            music: './assets/music/music3.mp3',
            image: './assets/img/tau.png'
        },

    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="playlist__item ${index === app.CurrentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="playlist__img">
                        <img src="${song.image}" alt="">
                    </div>
                    <div class="playlist__info">
                        <p class="playlist__info--name">${song.name}</p>
                        <p class="playlist__info--author">${song.singer}</p>
                    </div>
                    <i class="fa-solid fa-bars"></i>
                </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.CurrentIndex]
            }
        })
    },

    

    handleEvent: function() {
        const _this = this
        const playBtn = $('.music__control--play')
        const disable = $('.fa-play')
        const on = $('.fa-stop')
        const cd = $('.music__body--img')
        const range = $('.music__range--audio')
        const cdWidth = cd.offsetWidth
        const ldMode = $('.ldMode')


        // Light/Dark

        ldMode.onclick = function() {
            ldMode.classList.toggle('fa-moon')
            main.classList.toggle('black')
            musicDashboard.classList.toggle('black')
            musicDashboard.classList.toggle('border-dark')
            musicPlaylist.classList.toggle('music-play-color')

        }

        // Xử lý quay cd
        const cdAnimate = cd.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdAnimate.pause() 
        
        // Xử lý phóng to
        document.onscroll = function() {
           const scrollTop = window.scrollY || document.documentElement.scrollTop
           const newCdWidth = cdWidth - scrollTop

           cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0
           cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            }else {
                audio.play()
            }
          
        }
        // Khi song duoc play  
        audio.onplay = function() {
            _this.isPlaying = true
            disable.classList.add('disable')
            on.classList.remove('disable')
            cdAnimate.play()
        }

        // Khi pause

        audio.onpause = function() {
            _this.isPlaying = false
            disable.classList.remove('disable')
            on.classList.add('disable')
            cdAnimate.pause()
        }

        // Khi tien do bai hat thay doi

        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progress =  Math.floor(audio.currentTime / audio.duration * 100)
                range.value = progress
            }
        }

        //  Tua music
        range.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        //  Khi next bai hat
        nextSong.onclick = function() {
            if(_this.isRandom) {
                _this.playRandom()
            }else {
                _this.nextMusic()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Khi back bai hat
        backSong.onclick = function() {
            if(_this.isRandom) {
                _this.playRandom()
            }else {
                _this.preMusic()
            }
            audio.play()
            _this.render()
        }
        // random music
        random.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            random.classList.toggle('oncolor', _this.isRandom)
        }

        // Xu ly phat lai
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('oncolor', _this.isRepeat)
        }
        
        // Xử lý next song khi end
        audio.onended = function() {
               if(_this.isRepeat) {
                audio.play()
               } else {
                nextSong.click()
               }
        }
        // Lắng nghe hành vi click vào playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.playlist__item:not(.active)')
            // Xử lý khi click vào song
            if (songNode || e.target.closest('.fa-bars')) {
                
                if (songNode) {
                    _this.CurrentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // Xử lý khi click vào option 
                if (e.target.closest('.fa-bars')) {

                }
            }
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.playlist__item.active').scrollIntoView({
                behavior: 'smooth',
                block:'nearest',
            })
        }, 300)
    },


    loadCurrentSong: function() {
        const musicHeading = $('.music__header--name')
        const musicImg = $('.music__body--img')
        const audio = $('#audio')

        musicHeading.innerText = this.currentSong.name
        musicImg.innerHTML = ` <img src="${this.currentSong.image}" alt="">`
        audio.src = this.currentSong.music
    },
    nextMusic: function() {
        this.CurrentIndex++ 
        if(this.CurrentIndex >= this.songs.length ) {
            app.CurrentIndex = 0
        }

        this.loadCurrentSong()
    },
    preMusic: function() {
        this.CurrentIndex--
        if(this.CurrentIndex < 0) {
            app.CurrentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandom: function() {
        let newIndex 
      do {
        newIndex =  Math.floor(Math.random() * this.songs.length)
      } while(newIndex === this.CurrentIndex) 
    
      app.CurrentIndex = newIndex
      this.loadCurrentSong()
    },

    start: function() {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()
        // Lắng nghe/ xử lý các sk DOM EVENT
        this.handleEvent()
        // Tải thông tin bài hát đầu tiên 
        this.loadCurrentSong()
        // render ra playlist
        this.render()
    },
}

app.start()


