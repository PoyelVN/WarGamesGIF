<template>
  <div>
    <div class="title primary--text">War Games GIF</div>

    <v-dialog v-model="dialogReport" max-width="290" >
      <v-card class="card-modal" v-if="reporting" color="primary">
        <v-card-title class="headline white--text">Report this GIF?</v-card-title>
        <v-card-text
          class="white--text"
          style="margin-top:-15px"
        >You will not see anymore this GIF on your list.</v-card-text>
        <v-card-actions class="mt-3">
          <v-spacer></v-spacer>
          <v-chip
            color="white"
            text-color="error"
            style="width:105px;text-align:center;margin-right:10px;margin-top:-20px"
            class="pointer"
            @click="report()"
          >
            <span class="pointer" style="text-align:center;width:80px; font-weight:bold">Report</span>
          </v-chip>
        </v-card-actions>
      </v-card>
      <v-card class="card-modal" v-else color="primary">
        <v-card-title class="headline white--text">This GIF has just been reported</v-card-title>
        <v-card-text class="white--text" style="margin-top:-15px">
          Thank you for helping us keeping the content of
          <span class="white--text" style="font-weight:bold"> War Games GIF</span> clean and relevant.
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- <v-btn style="position: fixed; z-index:1;right:15px" round @click="test()">TEST</v-btn> -->
    <v-layout v-for="gif in gifs" :key="gif.uid">
      <v-flex xs12 sm6 offset-sm3 v-if="!hasBeenReported(gif)">
        <v-card>
          <v-img :src="gif.url" contain>
            <v-card-actions >
              <v-spacer></v-spacer>
              <v-layout align-end justify-start column fill-height >
                <v-flex>
                  <v-btn flat icon color="white">
                    <v-icon
                      class="shadow"
                      :class="{ 'primary--text': containUserVote('upvotes', gif) }"
                      @click="toggleVote('upvotes', gif)"
                    >keyboard_arrow_up</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex
                  class="text-xs-center white--text shadow"
                  style="width:35px"
                >{{gif.upvotes.length-gif.downvotes.length}}</v-flex>
                <v-flex>
                  <v-btn flat icon color="white">
                    <v-icon
                      class="shadow"
                      :class="{ 'primary--text': containUserVote('downvotes', gif) }"
                      @click="toggleVote('downvotes', gif)"
                    >keyboard_arrow_down</v-icon>
                  </v-btn>
                </v-flex>
                                <v-flex>
                  <v-btn flat icon color="white">
                    <v-icon
                      class="shadow"
                      small
                      @click="dialogReport = true, currentGif = gif, reporting = true"
                    >report_problem</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-img>
        </v-card>
      </v-flex>
    </v-layout>

    <v-btn color="primary" dark fab fixed bottom right>
      <v-icon>add</v-icon>
    </v-btn>

    <v-layout row justify-center>
      <v-btn color="primary" dark fab fixed bottom right @click="dialog = true">
        <v-icon>add</v-icon>
      </v-btn>

      <v-dialog v-model="dialog" max-width="290">
        <v-card color="primary">
          <v-card-title class="headline white--text">Add your GIF's URL</v-card-title>

          <v-text-field
            v-model="urlGif"
            color="secondary"
            placeholder="Your GIF's URL"
            solo
            class="mx-3"
          ></v-text-field>

          <div class="ml-3 white--text">{{error}}</div>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="white" flat="flat" @click="dialog = false, urlGif = ''">cancel</v-btn>

            <v-btn
              :disabled="isGif()"
              color="white"
              flat="flat"
              @click="dialog = false, addGif()"
            >Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
const fb = require("../firebaseConfig.js");
import { mapState } from "vuex";

export default {
  data: () => ({
    dialog: false,
    urlGif: "",
    error: "",
    reporting: true,
    dialogReport: false,
    currentGif: {}
  }),
  computed: {
    ...mapState(["user", "gifs"])
  },

  methods: {
    hasBeenReported(gif){
      if (this.user) {
        return gif['reported'].indexOf(this.user.uid) > -1;
      } else {
        return false;
      }
    },
    report() {
      // this.gifs[this.currentGif.uid].reported.push(this.user.uid);
      fb.gifsCollection.doc(this.currentGif.uid).update({
        reported: fb.firestore.FieldValue.arrayUnion(this.user.uid)
      });
      this.reporting = false;
    },

    isURL(str) {
      var pattern = new RegExp(
        /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/
      ); // fragment locator
      return pattern.test(str);
    },
    isGif() {
      console.log(this.isURL(this.urlGif));
      if (this.urlGif.match(/\.(gif)$/) != null && this.isURL(this.urlGif)) {
        this.error = "";
        return false;
      } else if (this.urlGif == "") {
        this.error = "";
        return true;
      } else {
        this.error = "This is not a GIF";
        return true;
      }
    },
    toggleVote(vote, gif) {
      if (!this.user) return;

      if (gif[vote] && gif[vote].indexOf(this.user.uid) > -1) {
        // user has already vote
        gif[vote] = gif[vote].filter(e => e !== this.user.uid);
        if (vote == "upvotes") {
          fb.gifsCollection.doc(gif.uid).update({
            upvotes: fb.firestore.FieldValue.arrayRemove(this.user.uid)
          });
        } else {
          fb.gifsCollection.doc(gif.uid).update({
            downvotes: fb.firestore.FieldValue.arrayRemove(this.user.uid)
          });
        }
      } else {
        // clear user's votes
        gif["upvotes"] = gif["upvotes"].filter(e => e !== this.user.uid);
        gif["downvotes"] = gif["downvotes"].filter(e => e !== this.user.uid);
        // add user's vote
        gif[vote]
          ? gif[vote].push(this.user.uid)
          : (gif[vote] = [this.user.uid]);

        if (vote == "upvotes") {
          fb.gifsCollection.doc(gif.uid).update({
            upvotes: fb.firestore.FieldValue.arrayUnion(this.user.uid),
            downvotes: fb.firestore.FieldValue.arrayRemove(this.user.uid)
          });
        } else {
          fb.gifsCollection.doc(gif.uid).update({
            downvotes: fb.firestore.FieldValue.arrayUnion(this.user.uid),
            upvotes: fb.firestore.FieldValue.arrayRemove(this.user.uid)
          });
        }
      }
    },
    containUserVote(vote, gif) {
      if (this.user) {
        return gif[vote].indexOf(this.user.uid) > -1;
      } else {
        return false;
      }
    },
    test() {
      this.$store.commit("setSnackbar", {
        color: "success",
        timeout: 3000,
        text: "GIF added"
      });
    },
    addGif() {
      if (!this.user) return;
      let self = this;
      fb.gifsCollection
        .add({
          url: this.urlGif,
          upvotes: [this.user.uid],
          downvotes: [],
          reported: [],
          userUid: this.user.uid
        })
        .then(function() {
          self.$store.commit("setSnackbar", {
            color: "success",
            timeout: 3000,
            text: "GIF added"
          });
          self.urlGif = "";
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};


</script>

<style>
.shadow {
  text-shadow: 0px 2px 5px black;
}
.title {
  position: fixed;
  z-index: 1;
  text-align: center;
  width:80%;
  margin-right: 10%;
  margin-left: 10%;
  margin-top: 10px;
  text-shadow: 0px 2px 5px black;
  font-family: mainFont !important;
  font-size: 35px !important;
}
@font-face {
  font-family: mainFont;
  src: url("../assets/INFECTED.ttf");
}
</style>
