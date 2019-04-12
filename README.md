# @aphorica/vuetify-message-box

General messageBox implementation along with helper.

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

## Notes

 - More documentation and examples forthcoming.

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
