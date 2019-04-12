export default {
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
