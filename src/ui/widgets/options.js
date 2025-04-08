export default {
    information: {
        options : {
            textSize: ['s', 'm', 'l'],
            header: "",
            showDescription: [true, false],
            showDateTime: [true, false],
            showLocation: [true, false],
            showCapacity: [true, false],
            showPrice: [true, false],
            showContact: [true, false]
        },
        default: {
            textSize: 'm',
            header: "",
            showDescription: true,
            showDateTime: true,
            showLocation: true,
            showCapacity: true,
            showPrice: true,
            showContact: true
        },
    },
    text: {
        options: {
            textSize: ['s', 'm', 'l'],
            alignment: ['left', 'center', 'right'],
            header: "",
            content: "",
            hidden: [true, false],
        },
        default: {
            textSize: 'm',
            alignment: 'left',
            header: "",
            content: "",
            hidden: false,
        }
    },
    children: {
        options: {
            textSize: ['s', 'm', 'l'],
            style: ['list', 'grid'],
            header: "",
        },
        default: {
            textSize: 'm',
            alignment: 'grid',
            header: "",
        }
    }
}