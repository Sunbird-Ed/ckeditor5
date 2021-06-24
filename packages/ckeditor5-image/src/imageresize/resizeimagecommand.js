/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imageresize/resizeimagecommand
 */

import { Command } from 'ckeditor5/src/core';
import { isImage } from '../image/utils';
import { isSupported } from './utils';

/**
 * The resize image command. Currently, it only supports the width attribute.
 *
 * @extends module:core/command~Command
 */
export default class ResizeImageCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const element = this.editor.model.document.selection.getSelectedElement();

		this.isEnabled = isImage( element );

		if ( !element || !element.hasAttribute( 'width' ) ) {
			this.value = null;
		} else {
			this.value = {
				width: element.getAttribute( 'width' ),
				height: null
			};
		}
	}

	/**
	 * Executes the command.
	 *
	 *		// Sets the width to 50%:
	 *		editor.execute( 'resizeImage', { width: '50%' } );
	 *
	 *		// Removes the width attribute:
	 *		editor.execute( 'resizeImage', { width: null } );
	 *
	 * @param {Object} options
	 * @param {String|null} options.width The new width of the image.
	 * @fires execute
	 */
	execute( options ) {
		const model = this.editor.model;
		const imageElement = model.document.selection.getSelectedElement();
		const userOptions = this.editor.config.get( 'image.resizeOptions' );

		const optionsToConvert = userOptions.filter(
			option => isSupported( option.name )
		);

		const shouldUseClasses = optionsToConvert.some( option => !!option.className );

		this.value = {
			width: options.width,
			height: null
		};

		if ( imageElement ) {
			model.change( writer => {
				if ( shouldUseClasses ) {
					writer.setAttribute( 'resizeImage', options.value, imageElement );
				} else {
					writer.setAttribute( 'width', options.width, imageElement );
				}
			} );
		}
	}
}
