import {EventBus} from '@aphorica/vue-event-bus'

export default {
  mounted() {
    EventBus.$on('open-mbox', this.onOpenMBox)
  },
  beforeDestroy() {
    EventBus.$off('open-mbox', this.onOpenMBox)
  },
  data: function() { return {
    mboxParams: {},
    mboxVisible: false
  }},
  methods: {
    onOpenMBox(mboxParams) {
      this.mboxParams = mboxParams;
      this.mboxVisible = true;
    },
    mboxClose() {
      this.mboxVisible = false
    }
  }
}
