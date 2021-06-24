
export const supportedOptions = [ 'resizeImage:25', 'resizeImage:50', 'resizeImage:75', 'resizeImage:100', 'resizeImage:original' ]

export function isSupported( option ) {
	return supportedOptions.includes( option );
}
