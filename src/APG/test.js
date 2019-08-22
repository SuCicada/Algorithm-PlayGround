/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2016 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Keyboard class monitors keyboard input and dispatches keyboard events.
 *
 * _Note_: many keyboards are unable to process certain combinations of keys due to hardware limitations known as ghosting.
 * See http://www.html5gamedevs.com/topic/4876-impossible-to-use-more-than-2-keyboard-input-buttons-at-the-same-time/ for more details.
 *
 * Also please be aware that certain browser extensions can disable or override Phaser keyboard handling.
 * For example the Chrome extension vimium is known to disable Phaser from using the D key. And there are others.
 * So please check your extensions before opening Phaser issues.
 *
 * @class Phaser.Keyboard
 * @constructor
 * @param {Phaser.Game} game - A reference to the currently running game.
 */
Phaser.Keyboard = function (game)
{

    /**
     * @property {Phaser.Game} game - Local reference to game.
     */
    this.game = game;

    /**
     * Whether the handler has started.
     * @property {boolean} active
     * @default
     */
    this.active = false;

    /**
     * Keyboard input will only be processed if enabled.
     * @property {boolean} enabled
     * @default
     */
    this.enabled = true;

    /**
     * @property {KeyboardEvent} event - The most recent DOM event from keydown or keyup. This is updated every time a new key is pressed or released.
     */
    this.event = null;

    /**
     * @property {object} pressEvent - The most recent DOM event from keypress.
     */
    this.pressEvent = null;

    /**
     * @property {object} callbackContext - The context under which the callbacks are run.
     */
    this.callbackContext = this;

    /**
     * @property {function} onDownCallback - This callback is invoked every time a key is pressed down, including key repeats when a key is held down. One argument is passed: {KeyboardEvent} event.
     */
    this.onDownCallback = null;

    /**
     * @property {function} onPressCallback - This callback is invoked every time a DOM onkeypress event is raised, which is only for printable keys. Two arguments are passed: {string} `String.fromCharCode(event.charCode)` and {KeyboardEvent} event.
     */
    this.onPressCallback = null;

    /**
     * @property {function} onUpCallback - This callback is invoked every time a key is released. One argument is passed: {KeyboardEvent} event.
     */
    this.onUpCallback = null;

    /**
     * @property {array<Phaser.Key>} _keys - The array the Phaser.Key objects are stored in.
     * @private
     */
    this._keys = [];

    /**
     * @property {array} _capture - The array the key capture values are stored in.
     * @private
     */
    this._capture = [];

    /**
     * @property {function} _onKeyDown
     * @private
     * @default
     */
    this._onKeyDown = null;

    /**
     * @property {function} _onKeyPress
     * @private
     * @default
     */
    this._onKeyPress = null;

    /**
     * @property {function} _onKeyUp
     * @private
     * @default
     */
    this._onKeyUp = null;

    /**
     * @property {number} _i - Internal cache var
     * @private
     */
    this._i = 0;

    /**
     * @property {number} _k - Internal cache var
     * @private
     */
    this._k = 0;

};

Phaser.Keyboard.prototype = {

    /**
     * Add callbacks to the Keyboard handler so that each time a key is pressed down or released the callbacks are activated.
     *
     * @method Phaser.Keyboard#addCallbacks
     * @param {object} context - The context under which the callbacks are run.
     * @param {function} [onDown=null] - This callback is invoked every time a key is pressed down.
     * @param {function} [onUp=null] - This callback is invoked every time a key is released.
     * @param {function} [onPress=null] - This callback is invoked every time the onkeypress event is raised.
     */
    addCallbacks: function (context, onDown, onUp, onPress) {

        this.callbackContext = context;

        if (onDown !== undefined && onDown !== null) {
            this.onDownCallback = onDown;
        }

        if (onUp !== undefined && onUp !== null) {
            this.onUpCallback = onUp;
        }

        if (onPress !== undefined && onPress !== null) {
            this.onPressCallback = onPress;
        }

    },
}