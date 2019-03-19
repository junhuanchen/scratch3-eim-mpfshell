const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
// const MathUtil = require('../../util/math-util');

const Scratch3MpfshellBlocks = require('../scratch3_mpfshell');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';
const menuIconURI = blockIconURI; 

const MicroBitTiltDirection = {
    FRONT: 'front',
    BACK: 'back',
    LEFT: 'left',
    RIGHT: 'right',
    ANY: 'any'
};

const MicroBitGestures = {
    MOVED: 'moved',
    SHAKEN: 'shaken',
    JUMPED: 'jumped'
};

const MicroBitButtons = {
    A: 'A',
    B: 'B',
    ANY: 'any'
};

let bpibit_this = null; // single mode

class Scratch3BpibitBlocks {
    
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        bpibit_this = this;
        this.id = '/bpibit';
        this.mpfshell = new Scratch3MpfshellBlocks(runtime, this.id);
        
        this.is_busy = false;
        
        this.button_a = false;
        this.button_b = false;
        this.pin_0 = false;
        this.pin_1 = false;
        this.pin_2 = false;
        this.connect({DATA: '', TIMEOUT: 1000});
    }

    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY () {
        return 'Scratch.bpibit';
    }
    /**
     * @return {array} - text and values for each buttons menu element
     */
    get BUTTONS_MENU () {
        return [
            {
                text: 'A',
                value: MicroBitButtons.A
            },
            {
                text: 'B',
                value: MicroBitButtons.B
            },
            {
                text: formatMessage({
                    id: 'microbit.buttonsMenu.any',
                    default: 'any',
                    description: 'label for "any" element in button picker for micro:bit extension'
                }),
                value: MicroBitButtons.ANY
            }
        ];
    }

    get GESTURES_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'microbit.gesturesMenu.moved',
                    default: 'moved',
                    description: 'label for moved gesture in gesture picker for micro:bit extension'
                }),
                value: MicroBitGestures.MOVED
            },
            {
                text: formatMessage({
                    id: 'microbit.gesturesMenu.shaken',
                    default: 'shaken',
                    description: 'label for shaken gesture in gesture picker for micro:bit extension'
                }),
                value: MicroBitGestures.SHAKEN
            },
            {
                text: formatMessage({
                    id: 'microbit.gesturesMenu.jumped',
                    default: 'jumped',
                    description: 'label for jumped gesture in gesture picker for micro:bit extension'
                }),
                value: MicroBitGestures.JUMPED
            }
        ];
    }

    get TILT_DIRECTION_MENU () {
        return [
            {
                text: formatMessage({
                    id: 'microbit.tiltDirectionMenu.front',
                    default: 'front',
                    description: 'label for front element in tilt direction picker for micro:bit extension'
                }),
                value: MicroBitTiltDirection.FRONT
            },
            {
                text: formatMessage({
                    id: 'microbit.tiltDirectionMenu.back',
                    default: 'back',
                    description: 'label for back element in tilt direction picker for micro:bit extension'
                }),
                value: MicroBitTiltDirection.BACK
            },
            {
                text: formatMessage({
                    id: 'microbit.tiltDirectionMenu.left',
                    default: 'left',
                    description: 'label for left element in tilt direction picker for micro:bit extension'
                }),
                value: MicroBitTiltDirection.LEFT
            },
            {
                text: formatMessage({
                    id: 'microbit.tiltDirectionMenu.right',
                    default: 'right',
                    description: 'label for right element in tilt direction picker for micro:bit extension'
                }),
                value: MicroBitTiltDirection.RIGHT
            }
        ];
    }

    /**
     * @return {array} - text and values for each tilt direction (plus "any") menu element
     */
    get TILT_DIRECTION_ANY_MENU () {
        return [
            ...this.TILT_DIRECTION_MENU,
            {
                text: formatMessage({
                    id: 'microbit.tiltDirectionMenu.any',
                    default: 'any',
                    description: 'label for any direction element in tilt direction picker for micro:bit extension'
                }),
                value: MicroBitTiltDirection.ANY
            }
        ];
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'bpibit',
            name: 'bpi:bit',
            // menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: 'isconnected',
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'bpibit.connect',
                        default: 'connect [DATA] [TIMEOUT]',
                        description: 'connect bpibit device.'
                    }),
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'bpibit.defaultArgsToOpen',
                                default: '',
                                description: 'connect device name(default is none to find).'
                            })
                        },
                        TIMEOUT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: formatMessage({
                                id: 'bpibit.defaultArgsToTimeOut',
                                default: '1000',
                                description: 'device control setInterval timeout.'
                            })
                        }
                    }
                },
                {
                    opcode: 'close',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'bpibit.close',
                        default: 'close',
                        description: 'close bpibit'
                    })
                },
                '---',
                {
                    opcode: 'whenButtonPressed',
                    text: formatMessage({
                        id: 'microbit.whenButtonPressed',
                        default: 'when [BTN] button pressed',
                        description: 'when the selected button on the bpi:bit is pressed'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'buttons',
                            defaultValue: MicroBitButtons.A
                        }
                    }
                },
                {
                    opcode: 'isButtonPressed',
                    text: formatMessage({
                        id: 'microbit.isButtonPressed',
                        default: '[BTN] button pressed?',
                        description: 'is the selected button on the bpi:bit pressed?'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'buttons',
                            defaultValue: MicroBitButtons.A
                        }
                    }
                },
                '---',
                {
                    opcode: 'displaySymbol',
                    text: formatMessage({
                        id: 'microbit.displaySymbol',
                        default: 'display [MATRIX]',
                        description: 'display a pattern on the micro:bit display'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MATRIX: {
                            type: ArgumentType.MATRIX,
                            defaultValue: '0101010101100010101000100'
                        }
                    }
                },
                {
                    opcode: 'displayText',
                    text: formatMessage({
                        id: 'microbit.displayText',
                        default: 'display text [TEXT]',
                        description: 'display text on the micro:bit display'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'microbit.defaultTextToDisplay',
                                default: 'Hello!',
                                description: `default text to display.
                                IMPORTANT - the micro:bit only supports letters a-z, A-Z.
                                Please substitute a default word in your language
                                that can be written with those characters,
                                substitute non-accented characters or leave it as "Hello!".
                                Check the micro:bit site documentation for details`
                            })
                        }
                    }
                },
                {
                    opcode: 'displayClear',
                    text: formatMessage({
                        id: 'microbit.clearDisplay',
                        default: 'clear display',
                        description: 'display nothing on the micro:bit display'
                    }),
                    blockType: BlockType.COMMAND
                },
                '---',
                {
                    opcode: 'whenPinConnected',
                    text: formatMessage({
                        id: 'microbit.whenPinConnected',
                        default: 'when pin [PIN] connected',
                        description: 'when the pin detects a connection to Earth/Ground'

                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'touchPins',
                            defaultValue: '0'
                        }
                    }
                }
            ],
            menus: {
                buttons: this.BUTTONS_MENU,
                gestures: this.GESTURES_MENU,
                tiltDirection: this.TILT_DIRECTION_MENU,
                tiltDirectionAny: this.TILT_DIRECTION_ANY_MENU,
                touchPins: ['0', '1', '2']
            }
        };
    }

    connect (args) {
        // console.log(args);
        this.mpfshell.open(args.DATA);
        this.mpfshell.exec({DATA: 'from microbit import *'});

        this.mpfshell.eim.socket.off('sensor', this.respond_data);
        this.mpfshell.eim.socket.on('sensor', this.respond_data);
        

        clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.request_data();
        }, args.TIMEOUT);
    }

    close () {
        clearInterval(this.interval);
        this.mpfshell.eim.socket.off('sensor', this.respond_data);
        this.mpfshell.close();
    }

    isconnected () {
        return this.mpfshell.mp_isconnected;
    }

    request_data () {
        if (this.isconnected()) {
            if (this.is_busy === false) {
                this.is_busy = true;
                const cmd = 'print("respond"' +
                    ', int(button_a.was_pressed())' +
                    ', int(button_b.was_pressed())' +
                    ', int(1 == pin0.read_digital())' +
                    ', int(1 == pin1.read_digital())' +
                    ', int(1 == pin2.read_digital())' +
                    ')';
                // console.log(cmd);
                this.mpfshell.exec({DATA: cmd});
            }
        }
    }

    respond_data (msg) {
        const _ec = 'eim/mpfshell/exec';

        if (msg.message.topic === (_ec + bpibit_this.id)) {
            const str = msg.message.payload;
            if (str.search('respond') !== -1) {
                const respond = str.split(' ');
                
                bpibit_this.button_a = respond[1] === '1';
                bpibit_this.button_b = respond[2] === '1';
                bpibit_this.pin_0 = respond[3] === '0';
                bpibit_this.pin_1 = respond[4] === '0';
                bpibit_this.pin_2 = respond[5] === '0';

                const cmd = '(button_a.reset(), button_b.reset())';
                // console.log(cmd);
                bpibit_this.mpfshell.exec({DATA: cmd});
                // console.log(respond, bpibit_this.button_a, bpibit_this.button_b);
            }
            bpibit_this.is_busy = false;
        }
        
        // console.log('respond_data', bpibit_this);
    }

    whenButtonPressed (args) {
        // console.log(args);
        if (args.BTN === 'any') {
            return this.button_a || this.button_b;
        } else if (args.BTN === 'A') {
            return this.button_a;
        } else if (args.BTN === 'B') {
            return this.button_b;
        }
        return false;
    }

    isButtonPressed (args) {
        if (args.BTN === 'any') {
            return this.button_a || this.button_b;
        } else if (args.BTN === 'A') {
            return this.button_a;
        } else if (args.BTN === 'B') {
            return this.button_b;
        }
        return false;
    }

    displaySymbol (args) {
        // console.log(args.MATRIX, args.MATRIX.match(/./g));

        let tmp = args.MATRIX.match(/./g); // Junk code
        tmp.splice(20, 0, ':'), tmp.splice(15, 0, ':'), tmp.splice(10, 0, ':'), tmp.splice(5, 0, ':'); // Junk code

        const cmd = 'display.show(Image("' + tmp.join("") + '"))';
        // console.log(cmd);
        this.mpfshell.exec({DATA: cmd});
    }

    displayText (args) {
        // console.log(args.TEXT);
        const cmd = 'display.scroll("' + args.TEXT + '")';
        // console.log(cmd);
        this.mpfshell.exec({DATA: cmd});
    }
 
    displayClear () {
        const cmd = 'display.clear()';
        // console.log(cmd);
        this.mpfshell.exec({DATA: cmd});
    }

    whenGesture (args) {
        console.log(args);
        // const gesture = cast.toString(args.GESTURE);
        // if (gesture === 'moved') {
        //     return (this._peripheral.gestureState >> 2) & 1;
        // } else if (gesture === 'shaken') {
        //     return this._peripheral.gestureState & 1;
        // } else if (gesture === 'jumped') {
        //     return (this._peripheral.gestureState >> 1) & 1;
        // }
        return false;
    }

    whenTilted (args) {
        console.log(args);
        return false;
    }

    isTilted (args) {
        console.log(args);
        return false;
    }

    getTiltAngle (args) {
        console.log(args);
        return false;
    }

    whenPinConnected (args) {
        // console.log(args.PIN);
        if (args.PIN === '0') {
            return this.pin_0;
        } else if (args.PIN === '1') {
            return this.pin_1;
        } else if (args.PIN === '2') {
            return this.pin_2;
        }
        return false;
    }
}

module.exports = Scratch3BpibitBlocks;
