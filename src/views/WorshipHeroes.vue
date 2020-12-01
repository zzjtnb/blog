<!--  -->
<template>
	<main class="site-main">
		<div class="bgcolor-fff lazyloaded section">
			<div class="box hidden-xs">
				<div class="ly">
					<a href="javascript:void(0)" onclick="_toggle('m1')">
						<img src="/images/Heroes/picture/pic.jpg" width="71" height="77" />
					</a>
				</div>
			</div>
			<div class="bgimg">
				<div class="container">
					<div class="chang_b">
						<div class="xianhua" v-if="switchName.xianhua_num">
							<img src="/images/Heroes/picture/pic1.png" width="525" height="148" />
						</div>
						<div class="gongan">
							<div class="dianzhu" v-if="switchName.dianzhu_num">
								<img id="m3_img" src="/images/Heroes/picture/lazhu.png" width="155" height="123" />
								<div id="m3_swf_container"></div>
							</div>
							<div class="jingjiu" v-if="switchName.jingjiu_num">
								<img src="/images/Heroes/picture/pic8.png" width="155" height="123" />
							</div>
						</div>
						<div class="jingli" v-if="switchName.jingli_num">
							<img id="m5_img" src="/images/Heroes/picture/jingli.gif" width="102" height="155" />
							<div id="m5_swf_container"></div>
						</div>
						<div class="jugong" v-if="switchName.jugong_num">
							<img id="m6_img" src="/images/Heroes/picture/jugong.gif" width="102" height="155" />
							<div id="m6_swf_container"></div>
						</div>

						<transition name="fade">
							<div class="coi_p" id="jidian_op_tips_container" v-if="tips">
								<div class="coi" id="jidian_op_tips_jingjiu">{{tipsText}}</div>
							</div>
						</transition>
					</div>
					<div id="musicbox" class="yin">
						<audio id="audio" loop="loop">
							<source src="/music/ylzg.mp3" type="audio/mp3" />
						</audio>
						<span id="MusicCtl" :class="{ muted : isMuted }" @click="playMusic"></span>
					</div>
					<div class="nav_l">
						<ul>
							<li>
								<a @click="show('xianhua_num')">献 花</a>
								<span id="xianhua_num">{{xianhua_num}}</span>
							</li>
							<li class="io">
								<a @click="show('dianzhu_num')">点 烛</a>
								<span id="dianzhu_num">{{dianzhu_num}}</span>
							</li>
							<li class="io1">
								<a @click="show('jingjiu_num')">敬 酒</a>
								<span id="jingjiu_num">{{jingjiu_num}}</span>
							</li>
							<li class="io2">
								<a @click="show('jingli_num')">敬 礼</a>
								<span id="jingli_num">{{jingli_num}}</span>
							</li>
							<li class="io3">
								<a @click="show('jugong_num')">鞠 躬</a>
								<span id="jugong_num">{{jugong_num}}</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
import { getRecode, editRecode } from '@/api/heroes'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      switchName: { "xianhua_num": false, "dianzhu_num": false, "jingjiu_num": false, "jingli_num": false, "jugong_num": false },
      recordUre: {},
      status: null,
      isMuted: true,
      tips: false,
      tipsText: '',
      form: {
        id: "",
        title: "",
        description: "",
        content: ""
      },
    }
  },
  computed: {
    ...mapGetters(['xianhua_num', 'dianzhu_num', 'jingjiu_num', 'jingli_num', 'jugong_num',])
  },
  created () {
    this.getHeroesRecode()
  },
  mounted () {

  },
  methods: {
    show (value) {
      if (sessionStorage.getItem(value)) {
        this.tipsText = sessionStorage.getItem(value)
        this.tips = true
        let times = setTimeout(() => {
          this.tips = false
          clearInterval(times)
        }, 1000);
      } else {
        this.recordUre[value] += 1
        this.$store.dispatch("LocalReload", this.recordUre)
        this.editHeroesRecode()
        this.switchName[value] = true
        if (value === "jingli_num") {
          this.switchName.jugong_num = false
        }
        if (value === "jugong_num") {
          this.switchName.jingli_num = false
        }
        let msg = { "xianhua_num": '献花', "dianzhu_num": '点烛', "jingjiu_num": '敬酒', "jingli_num": '敬礼', "jugong_num": '鞠躬' }
        sessionStorage.setItem(value, `你已经${msg[value]}了`); // 存储数据
      }
    },
    getHeroesRecode () {
      getRecode().then(response => {
        let result = response.data
        this.form['id'] = result.id
        this.form['title'] = result.files.record.filename
        this.form['description'] = result.description
        this.form['content'] = result.files.record.content
        this.recordUre = JSON.parse(this.form['content'])
        this.$store.dispatch("LocalReload", this.recordUre)
      })
    },
    editHeroesRecode () {
      this.form['content'] = JSON.stringify(this.recordUre)
      let files = {}
      files[this.form.title] = { content: this.form.content }
      let data = {
        'description': this.form.description,
        'public': true,
        'files': files
      }
      let headers = { "Authorization": "token 7f0d015cce46adcf728386abcf3603ecc23934bf" }
      editRecode(data, headers).then(response => {
        if (response.status == 200) {
          this.status = 200
          let result = response.data
          this.form['id'] = result.id
          this.form['title'] = result.files.record.filename
          this.form['description'] = result.description
          this.form['content'] = result.files.record.content
          this.recordUre = JSON.parse(this.form['content'])
          this.$store.dispatch("LocalReload", this.recordUre)
        }
      })
    },
    playMusic () {
      this.isMuted = !this.isMuted
      var audio = document.getElementById("audio");
      if (this.isMuted != false) {
        //停止
        audio.pause();
        audio.load();
      } else {
        //播放(继续播放)
        audio.play();
      }

    }
  },
  components: {

  },
}
</script>

<style scoped>
* {
	box-sizing: content-box;
	margin: 0;
	padding: 0;
	word-break: break-all;
}
.box {
	width: 100%;
	height: auto;
	background: url("/images/Heroes/bg_1.jpg") no-repeat center top;
	margin: 0 auto;
	overflow: hidden;
}
.ly {
	max-width: 1000px;
	height: 77px;
	margin: 0 auto;
	text-align: right;
}
.ly img {
	margin-right: 24px;
	float: right;
}
.bgimg {
	background: url("/images/Heroes//wmls-bg.jpg") no-repeat scroll center 0;
	width: 100%;
	height: 773px;
	position: relative;
	z-index: 0;
}
.container {
	max-width: 682px;
	height: auto;
	position: absolute;
	bottom: 1%;
	left: 50%;
	margin-left: -341px;
}
.chang_b {
	width: 682px;
	height: 242px;
	position: relative;
}
.xianhua {
	width: 525px;
	height: 128px;
	top: 0;
	margin: 10px auto;
	padding: 0 8px 0 0;
}
img {
	max-width: 100%;
	height: auto;
	border: none;
	box-sizing: border-box;
}
.gongan {
	width: 155px;
	height: 123px;
	top: 0;
	margin: 0 auto;
	padding: 0 8px 0 0;
}
.dianzhu {
	width: 155px;
	height: 100px;
	top: 60px;
	position: absolute;
}
.jingjiu {
	width: 155px;
	height: 57px;
	position: absolute;
	top: 60px;
}
.jingli {
	width: 99px;
	height: 220px;
	position: absolute;
	top: 60px;
	left: 50%;
	margin: 0 auto;
	margin-left: -55px;
}
.jugong {
	width: 110px;
	height: 220px;
	margin: 0 auto;
	position: absolute;
	top: 60px;
	left: 50%;
	margin-left: -55px;
}
.coi_p {
	bottom: 50%;
	width: 50%;
	height: 18%;
	margin: 0 auto;
	background: url("/images/Heroes//bg7.png") no-repeat;
	line-height: 31px;
	text-align: center;
	color: #fff;
	font-size: 14px;
	position: absolute;
	left: 50%;
	margin-left: -76px;
	top: 190px;
}
.coi {
	width: 153px;
	height: 31px;
	margin: 0 auto;
	background: url("/images/Heroes//bg7.png") no-repeat;
	line-height: 31px;
	text-align: center;
	color: #fff;
	font-size: 14px;
	position: absolute;
	top: 0px;
	left: 0px;
}
.yin {
	position: absolute;
	right: 0;
	bottom: 22%;
	float: right;
	max-width: 69px;
	height: 69px;
}
#MusicCtl {
	display: block;
	width: 60px;
	height: 60px;
	cursor: pointer;
	background: url(/images/Heroes/player.png) 0 0;
}

#MusicCtl.muted {
	background: url("/images/Heroes/player.png") -60px 0;
}

.nav_l {
	max-width: 679px;
	height: 69px;
	margin-top: 40px;
	background: url("/images/Heroes/bg1.png") no-repeat;
}

.nav_l ul {
	padding: 0;
	margin: 0;
	list-style: none;
	display: -webkit-box;
	display: -moz-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	-webkit-flex-flow: row wrap;
	justify-content: space-around;
}
.nav_l li {
	float: left;
	width: 68px;
	height: 56px;
	border-right: 1px solid #555557;
	background: url("/images/Heroes/bg2.png") no-repeat 22px 9px;
	padding: 10px 0 0 66px;
	line-height: 22px;
	color: #c70000;
	font-size: 13px;
}
.nav_l li a {
	font-family: "Microsoft yahei";
	color: #010101;
	font-size: 16px;
	display: block;
	cursor: pointer;
}
.nav_l li.io {
	background: url("/images/Heroes/bg3.png") no-repeat 22px 9px;
}
.nav_l li.io1 {
	background: url("/images/Heroes//bg41.png") no-repeat 22px 20px;
}
.nav_l li.io2 {
	background: url("/images/Heroes//bg5.png") no-repeat 34px 8px;
}
.nav_l li.io3 {
	border-right: none;
	background: url("/images/Heroes//bg6.png") no-repeat 27px 7px;
}
@media screen and (max-width: 600px) {
	.yin {
		right: 23%;
	}
	.xianhua {
		width: 50%;
	}
	.nav_l ul {
		justify-content: center;
		align-content: center;
	}
	.nav_l {
		width: 57%;
		margin: 0 22%;
	}
	.nav_l li {
		background: url(/images/Heroes/bg2.png) no-repeat 0 30%;
		padding: 0 0 0 12%;
	}
	.nav_l li.io {
		background: url(/images/Heroes/bg3.png) no-repeat 0 9px;
	}
	.nav_l li.io1 {
		background: url(/images/Heroes//bg41.png) no-repeat 0 20px;
	}
	.nav_l li.io2 {
		background: url(/images/Heroes//bg5.png) no-repeat 0 8px;
	}
	.nav_l li.io3 {
		border-right: none;
		background: url(/images/Heroes//bg6.png) no-repeat 0 7px;
	}
}
.site-main {
	display: block;
}

.lazyloaded {
	opacity: 1;
	transition: opacity 1s cubic-bezier(0.77, 0, 0.175, 1);
}
.section {
	background: url("/images/main/bg-2.png");
}
.bgcolor-fff {
	background-color: #fff;
}
</style>