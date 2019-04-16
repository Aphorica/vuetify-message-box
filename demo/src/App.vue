<template>
  <v-app>
    <MessageBoxComponent v-if="mboxVisible" :show="mboxVisible"
                     :params="mboxParams"
                     @close="mboxClose" />
    <v-toolbar dark app>
      <v-layout row justify-space-around>
        <v-btn raised round color="info"
              @click="basic">Basic</v-btn>
        <v-btn raised round color="info"
              @click="usingDoneFn">done Fn</v-btn>
        <v-btn raised round color="info"
              @click="withYesNoButtons">Yes/No</v-btn>
        <v-btn raised round color="info"
              @click="withPrompts">Prompts</v-btn>
      </v-layout>
    </v-toolbar>
    <v-content>
      <v-layout class="content-layout" column justify-end>
        <v-footer dark class="footer">{{output}}</v-footer>
      </v-layout>
    </v-content>
  </v-app>
</template>

<style>
  .output {height:100%}
  .content-layout {height:100%}
  .footer {padding: 2em; font-size: 1.3rem; }
</style>

<script>
import {MessageBox, MessageBoxComponent, MessageBoxMixin}
       from '@aphorica/vuetify-message-box'

export default {
  name: 'App',
  components: { MessageBoxComponent },
  mixins: [ MessageBoxMixin ],
  data () {
    return {
      output: ''
    }
  },
  methods: {
    setOutput(text) {
      this.output = 'Response: ' + text
    },
    basic() {
      MessageBox("Basic", "This is a basic message")
      this.output = 
`Message box invoked.  Note this following code is called before the
 message box is closed`
    },
    usingDoneFn() {
      let _this = this
      this.output = 
        'MessageBox invoked, but now waiting for click.'
      MessageBox("Basic", `<p>This is a basic html message</p>
                           <p>Watch footer text</p>`, {
        doneFn() {
          _this.setOutput(
            'MessageBox doneFn() called on click.')
        }
      })
    },
    withYesNoButtons() {
      let _this = this
      this.output = ''
      MessageBox("Answer", "Do you want to continue?",
        {
          btn1: {
            text: "Yes",
            primary: true
          },
          btn2: {
            text: "No",
          },
          doneFn: function(btnIX) {
            _this.setOutput('You chose "' + 
                    (btnIX === 1? "Yes" : "No")
                    + '"')
          }
        }
      )
    },
    withPrompts() {
      let _this = this
      function basicRule(v) {
        return (v.length >= 3) || 'Need three or more characters'
      }

      this.output = ''

      MessageBox("Info", "Fill in the following fields",
        {
          btn1: {
            text: "Cancel"
          },
          btn2: {
            text: "Ok",
            primary: true
          },
          prompts: [
            {
              prompt:"What is your name?",
              setFocus: true,
              rules: [ basicRule ]
            },
            {
              prompt:"What is your favorite color?",
              'initial-value': "Blue",
              rules: [ basicRule ]
            }
          ],
          doneFn: function(btnIX, responses) {
            if (btnIX === 1)
              _this.setOutput("You cancelled...")
            
            else {
              _this.setOutput("Your name is: " + responses[0] +
                            ", your favorite color is: " + responses[1])
            }
          }
        }
      )
    }
  }
}
</script>
