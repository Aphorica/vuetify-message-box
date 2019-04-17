# @aphorica/vuetify-message-box

github: https://aphorica.github.com<br/>
Web: https://aphorica.com

## Installing

`npm install @aphorica/vuetify-message-box`

or

`yarn add @aphorica/vuetify-message-box`

## Running the Demo

In a command prompt, cd info the 'demo' directory, and:

```
  (yarn|npm) install
  (yarn|npm run) serve)
```

Open a browser on `localhost:8080`

## Overview

General messageBox implementation along with helper.  Configurable with
title, message, buttons, checkboxes, and completion action.

Consists of three components:

<dl>
<dt>MessageBoxComponent</dt>
<dd>
This is the actual MessageBox component.  It needs to be imported and
incorporated in the template html and the code as follows:

```
  <template>
    ...
    <MessageBoxComponent v-if="mboxVisible" :show="mboxVisible"
                     :params="mboxParams"
                     @close="mboxClose" />
    ...
  </template>
  <script>
    import {MessageBoxComponent, MessageBoxMixin} from '@aphorica/vuetify-message-box'

    export default {
      components: { ..., MessageBoxComponent, ... },
      mixins: [MessageBoxMixin],
      ...
    }
  </script>
```

You can put it in any component, but App.vue makes the most sense.
</dd>
<dt>MessageBoxMixin</dt>
<dd>
Provides the default activation value and handlers.  This needs to be
imported along with the MessageBoxComponent in the same component.</dd>
<dt>MessageBox</dt>
<dd>A lightweight object with which you provide content and control
to the MessageBoxComponent.  You can import this anywhere you want to
show the MessageBoxComponent (including non-component code),
without having to reinstantiate or otherwise import the
MessageBoxComponent.

For example:
```
  import {MessageBox} from '@aphorica.vuetify-message-box'

   ...

  MessageBox('Title', 'This is a message')
        // (simplest invocation)
```
</dd>
</dt>

## Invocation

MessageBox(title, message, &lt;info&gt;)

args:
<dl>
<dt>title</dt>
<dd>The value to appear in the _v-card-title_ subpanel.</dd>
<dt>message</dt>
<dd>The value to appear in the _v-card-text_ subpanel.
    This can contain html.</dd>
<dt>info (optional)</dt>
<dd>Contains information to drive the message box behavior.</dd>
</dl>
 
If present, the _info_ object contains the following:
```
{
  btn1: {
    text: (the button text),
    primary: (optional, boolean) (whether the button is highlighted and has focus) ,
  },

  btn2: {
    (same members as above)
  },

  prompts: (optional) [
    {
      prompt: (string) - the prompt string,
      'initial-value': (string) - the initial value of the corresponding field,
      rules: [ (set of rule functions for the corresponding input field )],
      modifier: function for the corresponding input field,
      'setFocus': set this to the initially focused element,
      'selectAllOnFocus': self explanatory
    }
  ] (see notes)

  doneFn: (optional) a function that will be called when the MessageBox is closed.
          called with:
            - btnIX - the button index that was triggered (1-based), and
            - responses - (if prompts array is present)  responses to the
              input fields.

  returnFocus: (optional) (a dom object to which the focus should be returned
                when the MessageBox is closed.)
}
```

### Notes on the Info Object:
  If a prompts array is present, a number of things happen:
  
  - textfields will be displayed with the prompt strings.  Responses will be returned
    as an array, corresponding to each prompt.

  - rules are of the form: `v => (some condition test about v) || '(some error message)'`.  A rule
    returns either 'true' or a string indicating the error.  The string decorates the corresponding
    input field.

  - If rules are specified and there is a primary button, that button will be disabled until the
    rules are satisfied.

  - A modifier function accepts the current value and modifies it, if necessary, to
    fit constraints (such as lower casing everything.)  Modifiers are applied in 'keyup'
    handler.

## General Notes
 - In any invocation, this is non-blocking.  You need to remember 
   your app is still running &ndash; any code following will be executed.

   See further examples for acting on responses.

 - It is, however, implemented in a modal state &ndash; the user cannot
   interact with the application until they respond.

 - This will take on any styling you specify for _v-dialog_ and _v-card_,
   which means it should blend in seamlessly for any other dialogs you are
   using.

 - Would like to consolidate the MessageBoxMixin and MessageBox component
   into a single file, but that will require some refactoring and research.

 - As the name implies, this is currently based on _vuetify.js_ &mdash; may
   change that later.
