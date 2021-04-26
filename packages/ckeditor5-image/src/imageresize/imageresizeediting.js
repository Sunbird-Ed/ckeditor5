/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imageresize/imageresizeediting
 */

import { Plugin } from 'ckeditor5/src/core';
import ResizeImageCommand from './resizeimagecommand';

/**
 * The image resize editing feature.
 *
 * It adds the ability to resize each image using handles or manually by
 * {@link module:image/imageresize/imageresizebuttons~ImageResizeButtons} buttons.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ImageResizeEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImageResizeEditing';
	}

	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );

		editor.config.define( 'image', {
			resizeUnit: '%',
			resizeOptions: [ {
				name: 'resizeImage:original',
				value: null,
				icon: 'original'
			},
			{
				name: 'resizeImage:25',
				value: '25',
				icon: 'small'
			},
			{
				name: 'resizeImage:50',
				value: '50',
				icon: 'medium'
			},
			{
				name: 'resizeImage:75',
				value: '75',
				icon: 'large'
			} ]
		} );
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const resizeImageCommand = new ResizeImageCommand( editor );

		this._registerSchema();
		this._registerConverters();

		// Register `resizeImage` command and add `imageResize` command as an alias for backward compatibility.
		editor.commands.add( 'resizeImage', resizeImageCommand );
		editor.commands.add( 'imageResize', resizeImageCommand );
	}

	/**
	 * @private
	 */
	_registerSchema() {
		this.editor.model.schema.extend( 'image', { allowAttributes: 'width' } );
		this.editor.model.schema.setAttributeProperties( 'width', {
			isFormatting: true
		} );
	}

	/**
	 * Registers image resize converters.
	 *
	 * @private
	 */
	_registerConverters() {
		const editor = this.editor;

		// Dedicated converter to propagate image's attribute to the img tag.
		editor.conversion.for( 'downcast' ).add( dispatcher =>
			dispatcher.on( 'attribute:width:image', ( evt, data, conversionApi ) => {
				if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
					return;
				}

				const viewWriter = conversionApi.writer;
				const figure = conversionApi.mapper.toViewElement( data.item );

				// eslint-disable-next-line no-undef
				const resizeConfig = editor.config.get( 'image.resizeOptions' );
				// eslint-disable-next-line no-unused-vars
				const resizeOldValueClassName = resizeConfig.find( config => {
					return data.attributeOldValue && config.value === data.attributeOldValue.replace( '%', '' );
				} );
				// eslint-disable-next-line no-unused-vars
				const resizeNewValueClassName = resizeConfig.find( config => {
					return data.attributeNewValue && config.value === data.attributeNewValue.replace( '%', '' );
				} );

				if ( data.attributeNewValue !== null ) {
					// enable if style" needs to be added
					// viewWriter.setStyle( 'width', data.attributeNewValue, figure );
					viewWriter.addClass( 'image_resized', figure );
					if ( resizeOldValueClassName ) {
						viewWriter.removeClass( resizeOldValueClassName.className, figure );
					}
					if ( resizeNewValueClassName ) {
						viewWriter.addClass( resizeNewValueClassName.className, figure );
					}
				} else {
					// viewWriter.removeStyle( 'width', figure );
					viewWriter.removeClass( 'image_resized', figure );
					if ( resizeOldValueClassName ) {
						viewWriter.removeClass( resizeOldValueClassName.className, figure );
					}
				}
			} )
		);

		editor.conversion.for( 'upcast' )
			.attributeToAttribute( {
				view: {
					name: 'figure',
					styles: {
						width: /.+/
					}
				},
				model: {
					key: 'width',
					value: viewElement => viewElement.getStyle( 'width' )
				}
			} );
	}
}
