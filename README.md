
# Siteguide.js

Siteguide.js is an open source library made with vanilla Javascript and CSS to help you build website guides and onboarding tours.

Siteguide empowers you to create personalized tours and interactive guides for users within your application or website. With its simple and minimalistic design, Siteguide offers extensive customization options while remaining user-friendly and intuitive.

## Installation

```bash
npm install siteguide.js --save
```

## Quick Start Example

The following example is a simple tour with two steps.

```javascript
import { Tour } from 'siteguide.js';

const tour = new Tour({
    scrollTo: {
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
    },
});

const stepList = [
    {
        id: '1',
        host: '.step-1',
        popup: {
            text: "I'm step 1",
            title: 'Step 1',
            type: 'text',
        },
    },
    {
        id: '2',
        host: '.step-2',
        popup: {
            title: 'Step 2',
            text: "I'm step 2",
            type: 'text',
        },
    },
];

tour.addSteps(stepList);

tour.start();
```

## License

Siteguide.js is open source and free to use under the MIT license. See the [LICENSE](LICENSE) file for more information.
