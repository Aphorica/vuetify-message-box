"use strict"

import {EventBus} from '@aphorica/vue-event-bus'

/**
 * Present a messagebox with title, msg, and optional info.
 * Simplified access to MessageBoxComponent.vue component
 * 
 * @param {string} title 
 * @param {string} msg 
 * @param {object} info 
 * 
 * Info is optional. See the MessageBoxComponent.vue component for details:
 */
let MessageBox = function(title, msg, info) {
  EventBus.$emit('open-mbox', {
    headline: title,
    text: msg,
    info: info
    });
};

export default MessageBox;