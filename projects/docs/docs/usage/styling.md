---
sidebar_position: 1

---

# Styling

## Default styles

Siteguide has a default styling that you can override with your own styles. I try to keep the styles as minimal as possible, but still functional and easy to override.

## Fully override styles

First of all you can not include the default style file `siteguide.css` in your project.

Then you have an option to fully override the styles by setting the `classPrefix` option. This will add a custom prefix to all the classes used in the library instead of default `siteguide` prefix.

```js 
const tour: Tour = new Tour({
    classPrefix: 'custom-prefix'
});
```

This approach also helps you to provide own styles for each tour instance. 

## Custom step styles

You can also provide custom styles for each step. This is useful if you want to add some custom styles for a specific step.

```js
tour.addStep({
    id: '1',
    host: '.step-1',
    popup: {
        text: "I'm step 1",
        title: 'Step 1',
        type: 'text',
        customization: {
            class: 'custom-class',
            headerClass: 'custom-header-class',
            titleClass: 'custom-title-class',
            closeButtonClass: 'custom-close-button-class',
            contentClass: 'custom-content-class',
            descriptionClass: 'custom-description-class',
            footerClass: 'custom-footer-class',
            imageClass: 'custom-image-class',
        },
    },
})
```

Each class is optional and if not provided, the default class will be used. If you use the `classPrefix` option, you can also provide the custom classes to the `customization` option. It will be added to the end of the element `classList`, so new styles will override the previous styles.

## Button styles

Each button has a default style, but you can also provide your own styles for each button. This is useful if you want to add some custom styles for a specific button.

```js
tour.addStep({
    id: '2',
    popup: {
        title: 'Step 2',
        text: "I'm step 2",
        imgSrc: './sample-site-1/img/5.jpg',
        type: 'text',
        buttonList: [
            {
                text: 'Next',
                class: 'custom-button-class',
                action: tour.next,
            }
        ]
    }
});
```