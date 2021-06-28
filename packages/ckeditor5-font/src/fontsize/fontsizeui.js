/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module font/fontsize/fontsizeui
 */

import { Plugin } from 'ckeditor5/src/core';
import { Model, createDropdown, addListToDropdown } from 'ckeditor5/src/ui';
import { Collection } from 'ckeditor5/src/utils';

import { normalizeOptions } from './utils';
import { FONT_SIZE } from '../utils';

import fontSizeIcon from '../../theme/icons/font-size.svg';
import '../../theme/fontsize.css';

/**
 * The font size UI plugin. It introduces the `'fontSize'` dropdown.
 *
 * @extends module:core/plugin~Plugin
 */
export default class FontSizeUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'FontSizeUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		const options = this._getLocalizedOptions();

		const command = editor.commands.get( FONT_SIZE );

		// Register UI component.
		editor.ui.componentFactory.add( FONT_SIZE, locale => {
			const dropdownView = createDropdown( locale );
			addListToDropdown( dropdownView, _prepareListOptions( options, command ) );

			// Create dropdown model.
			dropdownView.buttonView.set( {
				label: t( 'Font Size' ),
				icon: fontSizeIcon,
				tooltip: true
			} );

			dropdownView.extendTemplate( {
				attributes: {
					class: [
						'ck-font-size-dropdown'
					]
				}
			} );

			dropdownView.bind( 'isEnabled' ).to( command );

			// Execute command when an item from the dropdown is selected.
			this.listenTo( dropdownView, 'execute', evt => {
				editor.execute( evt.source.commandName, { value: evt.source.commandParam } );
				editor.editing.view.focus();
			} );

			return dropdownView;
		} );
	}

	/**
	 * Returns options as defined in `config.fontSize.options` but processed to account for
	 * editor localization, i.e. to display {@link module:font/fontsize~FontSizeOption}
	 * in the correct language.
	 *
	 * Note: The reason behind this method is that there is no way to use {@link module:utils/locale~Locale#t}
	 * when the user configuration is defined because the editor does not exist yet.
	 *
	 * @private
	 * @returns {Array.<module:font/fontsize~FontSizeOption>}.
	 */
	_getLocalizedOptions() {
		const editor = this.editor;
		const t = editor.t;

		const localizedTitles = {
			Default: t( 'Default' ),
			Tiny: t( 'Tiny' ),
			Small: t( 'Small' ),
			Big: t( 'Big' ),
			Huge: t( 'Huge' ),
			XLarge: t( 'XLarge' ),
			'1': t( '1' ),
			'2': t( '2' ),
			'3': t( '3' ),
			'4': t( '4' ),
			'5': t( '5' ),
			'6': t( '6' ),
			'7': t( '7' ),
			'8': t( '8' ),
			'9': t( '9' ),
			'10': t( '10' ),
			'11': t( '11' ),
			'12': t( '12' ),
			'13': t( '13' ),
			'14': t( '14' ),
			'15': t( '15' ),
			'16': t( '16' ),
			'17': t( '17' ),
			'18': t( '18' ),
			'19': t( '19' ),
			'20': t( '20' ),
			'21': t( '21' ),
			'22': t( '22' ),
			'23': t( '23' ),
			'24': t( '24' ),
			'25': t( '25' ),
			'26': t( '26' ),
			'27': t( '27' ),
			'28': t( '28' ),
			'29': t( '29' ),
			'30': t( '30' ),
			'36': t( '36' )
		};

		const options = normalizeOptions( editor.config.get( FONT_SIZE ).options );

		return options.map( option => {
			const title = localizedTitles[ option.title ];

			if ( title && title != option.title ) {
				// Clone the option to avoid altering the original `namedPresets` from `./utils.js`.
				option = Object.assign( {}, option, { title } );
			}

			return option;
		} );
	}
}

// Prepares FontSize dropdown items.
// @private
// @param {Array.<module:font/fontsize~FontSizeOption>} options
// @param {module:font/fontsize/fontsizecommand~FontSizeCommand} command
function _prepareListOptions( options, command ) {
	const itemDefinitions = new Collection();

	for ( const option of options ) {
		const def = {
			type: 'button',
			model: new Model( {
				commandName: FONT_SIZE,
				commandParam: option.model,
				label: option.title,
				class: 'ck-fontsize-option',
				withText: true
			} )
		};

		if ( option.view && option.view.styles ) {
			def.model.set( 'labelStyle', `font-size:${ option.view.styles[ 'font-size' ] }` );
		}

		if ( option.view && option.view.classes ) {
			def.model.set( 'class', `${ def.model.class } ${ option.view.classes }` );
		}

		def.model.bind( 'isOn' ).to( command, 'value', value => value === option.model );

		// Add the option to the collection.
		itemDefinitions.add( def );
	}

	return itemDefinitions;
}
