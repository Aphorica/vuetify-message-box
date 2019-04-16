<template>
<!-- description in the <script> section -->
  <v-dialog v-model="showingMBox" ref="mbDialog"
            persistent max-width="290px">
    <v-card>
      <v-card-title v-if="headline.length > 0"
                    id="headline">
        {{headline}}
      </v-card-title>
      <v-card-text v-html="text"></v-card-text>
<!--      <v-form v-if="prompts" v-model="valid" ref="form"> -->
      <v-layout v-if="prompts" column>
        <hr/>
        <v-flex v-for="(prompt,ix) in prompts" :key="ix" xs12 px-3>
          <v-text-field class="prompt"
            required
            @keyup.native="(event)=>onTextFieldKeyUp(event, ix)"
            @focus="(event)=>onPromptFocus(event, prompt)"
            :rules="[v => fieldRules(v, ix)]"
            :value="prompt['initial-value'] || ''"
            :label="prompt.prompt">
          </v-text-field>
<!--
          <span class="error-field"
                v-if="errs[ix].length !== 0">{{errs[ix]}}</span> -->
        </v-flex>
      </v-layout>
<!--       </v-form>  -->
      <hr/>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="btn1Text.length > 0" 
               color="primary" round :flat="!btn1Primary" 
               @click.native="btnClick(1)"
               :disabled="btn1Disabled">
          {{btn1Text}}
        </v-btn>
        <v-btn color="primary" round :flat="!btn2Primary"
               @click.native="btnClick(2)"
               :disabled="btn2Disabled">
          {{btn2Text}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  #headline { background-color:#3F51B5; color:antiquewhite;
                     font-size:2rem}
</style>
<script>
/**
 Parameter Driven MessageBox implementation.  Besides displaying messages, the
 mbox can also field prompts and return responses to the prompts.
 
 The parameter item must be present and contains the following:
 
  {
    mboxHeadline: (required) (the headline text for the box),
    mboxText: (required) (the text for the body of the box - can contain html),
    info: (optional)
  }

    See the README.md in the repository for further info

    16-Apr-2019 - rickb
 */
import MessageBox from './MessageBox';
import {KeyCodes,JSUtils as AphJSUtils} from '@aphorica/js-utils';
export default {
  name: 'MessageBoxComponent',
  props: {
    show: Boolean,
    params: Object
  },
  data: function() {return {
    valid: true,
    headline: '',
    text: '',
    prompts: null,
    responses: null,
    errs: null,
    info: {},
    btn1Disabled: false,
    btn2Disabled: false,
    defaultInfo: {
      btn1: null,
      btn2: {
        text: this.$t('ok'),
        primary: true
      },
      doneFn: this.defaultDoneFn
    },
    inKeyupEventHandler: false
  }},
  methods: {
    btnClick(btnIX) {
      this.info.doneFn(btnIX, this.responses);
      this.showingMBox = false;
    },
    defaultDoneFn(btnText) { this.showingMbox = false; },
    onTextFieldKeyUp(evt, ix) {
      if (this.prompts[ix].modifier)
        this.prompts[ix].modifier(evt);
      this.responses[ix] = evt.target.value;
      this.checkDisabled();
    },
    onKeyUp(evt) {
      if (this.inKeyupEventHandler)
        return;

      this.inKeyupEventHandler = true;
      if (evt.keyCode === KeyCodes.RETURN_KEY || evt.keyCode === KeyCodes.ESC_KEY) {
        AphJSUtils.stopEvent(evt);
        let primaryBtn = this.primaryBtn;
        this.btnClick(primaryBtn? this.primaryBtnIX : 0);
      }

      this.inKeyupEventHandler = false;
    },
    onPromptFocus(evt, prompt) {
      if (prompt.selectAllOnFocus)
        evt.target.select();
    },
    onShowing() {
      let ix, prompt;
      for (ix = 0; ix < this.prompts.length; ++ix) {
        prompt = this.prompts[ix];
        if (prompt.setFocus) {
          let nx;
          let inputs = document.getElementsByTagName('input'),
              input;
          for (nx = 0; nx < inputs.length; ++nx) {
            input = inputs[nx];
            if (input.attributes['aria-label'].nodeValue === prompt.prompt) {
              input.focus();
              break;
            }
          }
        }
      }
    },
    fieldRules(v, ix) {
      if (this.prompts[ix].rules) {
        let rules = this.prompts[ix].rules;
        let response;
        for (let nx = 0; nx < rules.length; ++nx) {
          response = rules[nx](v);
          if (response !== true)
            return response;
        }
      }
      return true;
    },
    checkDisabled() {
      if (this.prompts && this.primaryBtnIX !== 0) {
        let disabled, response;
        for (let ix = 0; ix < this.prompts.length; ++ix) {
          response = this.fieldRules(this.responses[ix], ix);
          disabled = response !== true;
                  // check all response fields - if it doesn't
                  // explicitly return true, it's a failure.

 
          if (this.btn1Primary) this.btn1Disabled = disabled;
          else if (this.btn2Primary) this.btn2Disabled = disabled;
                  // note this will disable or enable

          if (disabled)
            return;
                  // if one rule fails, exit - that one sticks
        }
      }
    }
  },
  computed: {
    showingMBox: {
      get: function() {
        if (this.show) {
          this.headline = this.params.headline || '';
          this.text = this.params.text;
					if (this.params.info) {
						let newDefaultInfo = Object.assign({}, this.defaultInfo);
            this.info = {...newDefaultInfo, ...this.params.info};
									// assign mods the target object...
					}
					
          else
            this.info = this.defaultInfo;

          if (this.info.prompts) {
            this.prompts = this.info.prompts;
            this.responses = new Array(this.prompts.length);
            this.prompts.forEach((prompt, ix)=>{
              this.responses[ix] = prompt['initial-value'] || '';
            });
            this.errs = new Array(this.prompts.length).fill('');
                    // hoist the prompts and add responses array
            this.checkDisabled();
            this.$nextTick(this.onShowing);
          }
        }

        this.inKeyupEventHandler = false;
        window.document.addEventListener('keyup', this.onKeyUp);
        return this.show;
      },
      set: function(value) {
        if (!value) {
          window.document.removeEventListener('keyup', this.onKeyUp);
          this.$emit('close');
          if (this.info.returnFocus)
            this.info.returnFocus.focus();
        }
      }
    },
    btn1Text: function() {
      return this.info.btn1? this.info.btn1.text : ''
    },
    btn2Text: function() { return this.info.btn2? this.info.btn2.text : '' },
    btn1Primary: function() { return this.info.btn1 && this.info.btn1.primary?
                                    this.info.btn1.primary : false },
    btn2Primary: function() {
      if (this.info.btn2 && this.info.btn2.primary)
        return this.info.btn2.primary;
        
      return !(this.info && this.info.btn1);
    },
    primaryBtn: function() {
      return this.btn1Primary? this.info.btn1 : this.btn2Primary? this.info.btn2 : null;
    },
    primaryBtnIX: function() {
      return this.btn1Primary? 1 : this.btn2Primary? 2 : 0;
    }
  }
}
</script>
