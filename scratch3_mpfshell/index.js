const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
// const MathUtil = require('../../util/math-util');

const Scratch3EimBlocks = require('../scratch3_eim');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIaSURBVFhH7ZYxSxxRFIU3BBEh6cUihYgys7GQdCEgBCFNGuuARdKmCViZwoCV4LzdxRCSwt7GJnX+gpVdCIiSImF1RhbWTs09d+4Zn2933XWXtcl+cHj3nXvfzBlmWLY04r+knLntOE0O47T6RI04dT/izF1RagbEfz8/6jbTjYXm9pR/jSirvNVGGCDKtha04eH3IbPvRHE+dRe6l4fKGwyQJvudblAc7tDvBZ6dq28+NivnOoA7aXeD+TO3BC86Tb6H/fJJ9V2Uua8Q9nKNus381gFh5rI2jj7PyoPucF7xApxzSAZWrV0kD2sgZ3bptRNm8MSdeoofoHxaeRUO+PuWnh8gdetmF3NR6tbMKrzbXsG57m0QdTmtuLyXvA97wA9glkLvxqztew7Q7p237IcR4NnVtzEOUzootOy7B2iY1XsAwGFVoxabfWsA0Ut4T7PqMj08jA4K9HoKIB/PHx4wSwm9IMBN2Q8Ood8SQD60lShLPsn60SwFHmRbJfT8ALq3Wn7nX+iAB8/O/KyNmzU4YYB7ZxRgxDB5LsJ7pQDWvbzsCs/siFjfCRyazcvShK33HuA4LwsYACv0QASORPQmYQioQd8BpkW86BcYAupmXmp9IEII3uChiDXXvgOQDyL/onwFqH+JFq32Bbj2HeCNra9F/kXDAMC/Ab8begN9A9QcDAF1uwD4/8jZDRgCajDwKxgxREqlfzEVeGA9qCDjAAAAAElFTkSuQmCC';
const menuIconURI = blockIconURI;

class Scratch3MpfshellBlocks {
    constructor (runtime, id = '/default') {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        
        this.runtime = runtime;
        this.eim = new Scratch3EimBlocks();

        Object.defineProperty(this, 'mp_id', {
            get: () => this.eim.socket.mp_id,
            set: value => (this.eim.socket.mp_id = value)
        });

        Object.defineProperty(this, 'mp_isconnected', {
            get: () => this.eim.socket.mp_isconnected,
            set: value => (this.eim.socket.mp_isconnected = value)
        });

        this.mp_id = id;
        this.mp_isconnected = false;
        this.eim.socket.off('sensor', this.check_connect);
        this.eim.socket.on('sensor', this.check_connect);

        setInterval(() => {
            this.get_state();
        }, 10000);

    }

    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY () {
        return 'Scratch.mpfshell';
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'mpfshell',
            name: formatMessage({
                id: 'mpfshell.categoryName',
                default: 'Mpfshell',
                description: 'Use it to control your micropython'
            }),
            // menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: 'listenTopic',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'mpfshell.listenTopic',
                        default: 'Listening to the [TOPIC] ',
                        description: 'receive target topic message'
                    }),
                    arguments: {
                        TOPIC: {
                            type: ArgumentType.STRING,
                            defaultValue: 'eim/mpfshell/exec'
                        }
                    }
                },
                {
                    opcode: 'message',
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: 'open',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'mpfshell.open',
                        default: 'open [DATA]',
                        description: 'connect micropython device.'
                    }),
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'mpfshell.defaultArgsToOpen',
                                default: '',
                                description: 'connect device name(default is none to find).'
                            })
                        }
                    }
                },
                {
                    opcode: 'exec',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'mpfshell.exec',
                        default: 'exec [DATA]',
                        description: 'exec micropython code'
                    }),
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'mpfshell.defaultCodeToExec',
                                default: 'print("mpfshell")',
                                description: 'mpfshell code.'
                            })
                        }
                    }
                },
                {
                    opcode: 'isconnected',
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: 'close',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'mpfshell.close',
                        default: 'close',
                        description: 'request close'
                    })
                },
                {
                    opcode: 'mpfshell',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'mpfshell.mpfshell',
                        default: 'mpfshell [TOPIC] [DATA]',
                        description: 'control mpfshell'
                    }),
                    arguments: {
                        TOPIC: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'mpfshell.defaultTopicToMpfshell',
                                default: 'exec',
                                description: 'mpfshell cmd.'
                            })
                        },
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'mpfshell.defaultDataToMpfshell',
                                default: 'print("mpfshell")',
                                description: 'mpfshell msg.'
                            })
                        }
                    }
                }
            ],
            menus: {}
        };
    }

    get_state () {
        const isconnected = 'eim/mpfshell/isconnected';
        this.eim.broadcastTopicMessage({mutation: null, TOPIC: isconnected + this.mp_id});
    }

    check_connect (msg) {
        
        const _is = 'eim/mpfshell/isconnected';
        const _cl = 'eim/mpfshell/close';
        const _op = 'eim/mpfshell/open';

        if (msg.message.topic === (_is + this.mp_id)) {
            if (msg.message.payload === 'True') {
                this.mp_isconnected = true;
            } else {
                this.mp_isconnected = false;
            }
        } else if (msg.message.topic === _cl + this.mp_id) {
            this.mp_isconnected = false;
        } else if (msg.message.topic === _op + this.mp_id) {
            if (msg.message.payload === 'Already connected' || (msg.message.payload.search('Connected to ') !== -1)) {
                this.mp_isconnected = true;
            } else {
                this.mp_isconnected = false;
            }
        }
        
        // console.log(this);
    }

    listenTopic (args) {
        const targetTopic = args.TOPIC;
        if (targetTopic === this.eim.topic) {
            // console.log(`targetMessage: ${args.TOPIC}`);
            this.eim.message = null; // 每次清空
            this.eim.topic = null;
            return true;
        }
    }

    message () {
        // console.log(this.eim.getComingMessage());
        return this.eim.getComingMessage();
    }

    open (args) {
        const command = 'eim/mpfshell/open';
        const message = args.DATA;
        this.eim.broadcastTopicMessage({mutation: null, TOPIC: command + this.mp_id, DATA: message});
        // console.log(message);
    }
    
    isconnected () {
        return this.mp_isconnected;
    }

    exec (args) {
        const command = 'eim/mpfshell/exec';
        const message = args.DATA;
        this.eim.broadcastTopicMessage({mutation: null, TOPIC: command + this.mp_id, DATA: message});
        // console.log(message);
    }

    close () {
        const command = 'eim/mpfshell/close';
        this.eim.broadcastTopicMessage({mutation: null, TOPIC: command + this.mp_id});
        // console.log(message);
    }

    mpfshell (args) {
        const command = 'eim/mpfshell/';
        const message = args.DATA;
        this.eim.broadcastTopicMessage({mutation: null, TOPIC: command + args.TOPIC + this.mp_id, DATA: message});
        // console.log(message);
    }

}

module.exports = Scratch3MpfshellBlocks;
