import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-youtube-video',
  templateUrl: './youtube-video.component.html',
  styleUrls: ['./youtube-video.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class YoutubeVideoComponent implements OnInit {

  @Input() videoId: string;

  player;

  constructor() { }

  ngOnInit() {
    (<any>window).onYouTubeIframeAPIReady= () => {
      this.player = new (<any>window).YT.Player('player', {
        videoId: this.videoId,
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange
        }
      });
    }
  }

  ngAfterViewInit() {
    const doc = (<any>window).document;
    const playerApiScript = doc.createElement('script');
    playerApiScript.type = 'text/javascript';
    playerApiScript.src = 'https://www.youtube.com/iframe_api';
    doc.body.appendChild(playerApiScript);
  }

  onPlayerReady(event) {
    event.target.playVideo();
  }

  onPlayerStateChange = (event) => {
    if (event.data == (<any>window).YT.PlayerState.ENDED) {
      this.player.seekTo(0);
    }
  }

}
