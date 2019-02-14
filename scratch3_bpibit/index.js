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
const blockIconURI = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAAaACADASEAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAABgcFAwT/xAApEAACAgEDAwMDBQAAAAAAAAABAgMEEQUGEgATIQciMTJBURVDYWJx/8QAGAEAAwEBAAAAAAAAAAAAAAAAAQIDBAX/xAAnEQABAwIFAgcAAAAAAAAAAAABAAIDERIFEyExQVHwBDJhcYGxsv/aAAwDAQACEQMRAD8Artrf1Ga2KWgV3162/MRmvIqV2dUD8O8x4luLZwnIjByBjojd1zVtwQVpLGry1IrvBq0NBXgqo6u5eKxZYK2eAAPBgQVf2EgBqudZ7qAFyOJbtbP187n2tJNd0CTFSzUBeVYHVRxhZstyGSFWVSVBf7qcNZNt7gr7m0CtqdccO8is8RYExkqGwf8AQQRkAkMDgZ6N1yBbRQnYl+KXSl0DVmhRpGFjTbE0zBKpYMO4w+h1yWxGxwXLKQObEN7lv9ar3tRsVFeqiFNVit5MMJLKEsxxrwkbEfkMwVuCrxYFSCslLjTvsp21tFV4tUlbvtbmt1rdurXYSXdTPajv1wv7UJ9vMMR4JXkGBJKTZBXbW5tJ2ru8V9q37E1SwwOLkWO+fKmF2U/lQyOq5UuQQQT0YwaE8IPpoOVoet20V0e+m4KdKNq1uRi8vNg1eduJJABAwwRj8Hyz58lMcKPqetx9M1GDTHtbsgUxyySvyhkjSNhniSFTw7sSoBHFhni7dWMYcwO6bqQeQ4hZ2lbL3Du6Du69an06hAxFaWcqsCBvLCKPI9vuUrxAQhSAR4xR9obHbS55cxNDWhJSCScI1hlyuQSB/XA+PAX6gBjmSyHxL8iLyjcrS2kLcx+54Svf0MU/p7ryzRpIooyuA6ggMqkqfP3BAIP2I6iVuhTqnZ81epBDLJVMrvHGFZnFeJgxI+SGJOfyc9aJ3ObHoev5KnGAXa+n2q1pteGbXklliSSThOeTKCcrOAvn+B4H46QSE/OT0mFgZA+VDECcxf/Z';
const menuIconURI = blockIconURI; 

class Scratch3BpibitBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.mpfshell = new Scratch3MpfshellBlocks();
    }

    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY () {
        return 'Scratch.bpibit';
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'bpibit',
            name: formatMessage({
                id: 'bpibit.categoryName',
                default: 'Bpibit',
                description: 'Use it to control your micropython'
            }),
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
                        default: 'connect [DATA]',
                        description: 'connect micropython device.'
                    }),
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'bpibit.defaultArgsToOpen',
                                default: '',
                                description: 'connect device name(default is none to find).'
                            })
                        }
                    }
                },
                {
                    opcode: 'display',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'bpibit.dispaly',
                        default: 'dispaly [DATA]',
                        description: 'dispaly led pixel'
                    }),
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'bpibit.defaultTextToDispaly',
                                default: 'hello world!',
                                description: 'bpibit display.'
                            })
                        }
                    }
                }
            ],
            menus: {

            }
        };
    }

    display (args) {
        const cmd = "display.scroll('" + args.DATA + "')";
        // console.log(cmd);
        this.mpfshell.exec({mutation: null, TOPIC: 'eim/mpfshell/exec', DATA: cmd});
    }

    connect (DATA) {
        this.mpfshell.open(DATA);
        this.mpfshell.exec({mutation: null, TOPIC: 'eim/mpfshell/exec', DATA: 'from microbit import *'});
    }

    isconnected () {
        this.mpfshell.isconnected();

        return this.mpfshell.return_info();
    }

}

module.exports = Scratch3BpibitBlocks;
