# Anatomy of a component

TIP: This guide assumes you've already read the [Essentials Guide](essentials). Read that first if you're new to Angular.

Every component must have:

* A TypeScript class with _behaviors_ such as handling user input and fetching data from a server
* An HTML template that controls what renders into the DOM
* A [CSS selector](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors) that defines how the component is used in HTML

## Creating a component

<docs-workflow>
<docs-step title="Create the class">
Add the `@Component` decorator to a TypeScript class.

```angular-ts
@Component({selector: 'profile-photo', template: `<img src="profile-photo.jpg" alt="Your profile photo">`})
export class ProfilePhoto { }
```
</docs-step>
<docs-step title="Register the selector">
The selector `profile-photo` lets other templates use the component.
</docs-step>
</docs-workflow>

## Using components

You can use a component by creating a matching HTML element in the template of other components.

<docs-code language="angular-html">
<profile-photo />
</docs-code>

<docs-code header="profile-photo.ts"
  path="adev/src/content/examples/profile/src/app/profile-photo.ts"
  visibleLines="[1, 10]"/>

HELPFUL: The "selector" of a component is a CSS selector: `profile-photo` matches `<profile-photo>`.
