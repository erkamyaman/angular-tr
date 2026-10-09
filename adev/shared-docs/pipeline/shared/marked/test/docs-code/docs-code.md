<docs-code>
this is code
</docs-code>

<docs-code path="./example-with-eslint-comment.ts" />
<docs-code path="./example-with-region.ts" />

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="./messages.fr.xlf" />

<docs-code header="Property names should not be linked" language="ts">  
const form = {  
  state: ['']  
};  
</docs-code>

<docs-code hideDollar code="echo 'hello world'" />

<docs-code language="typescript">
  if (foo) {
    // bar
  }
</docs-code>

<docs-code header="Member access should not be linked" language="ts">
const router = inject(Router);
const app = this.router.Router;
const ref = this.app?.ApplicationRef;
const kind = Router.ApplicationRef;
</docs-code>
