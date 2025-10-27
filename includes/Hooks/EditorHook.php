<?php
/**
 * Hook to add WandaScribe assistance to wikitext editor
 *
 * @author  Naresh Kumar Babu <nk2indian@gmail.com>
 * @file
 * @ingroup WandaScribe
 */

namespace MediaWiki\Extension\WandaScribe\Hooks;

use MediaWiki\MediaWikiServices;
use OutputPage;
use Skin;

/**
 * Hooks for adding WandaScribe to the wikitext editor
 */
class EditorHook {

	/**
	 * Add WandaScribe module to edit pages
	 *
	 * @param OutputPage $out
	 * @param Skin $skin
	 * @return void
	 */
	public static function onBeforePageDisplay( OutputPage $out, Skin $skin ): void {
		$title = $out->getTitle();
		
		// Only add on edit pages
		$action = $out->getRequest()->getVal( 'action', 'view' );
		// if ( !in_array( $action, [ 'edit', 'submit' ] ) || !$title || !$title->exists() && $action !== 'edit' ) {
		// 	return;
		// }

		// Check if Wanda extension is loaded
		$extensionRegistry = \ExtensionRegistry::getInstance();
		if ( !$extensionRegistry->isLoaded( 'Wanda' ) ) {
			return;
		}

		// Add the WandaScribe module
		$out->addModules( 'ext.wandascribe.editor' );
		
		// Pass configuration to JavaScript
		$config = MediaWikiServices::getInstance()->getMainConfig();
		$out->addJsConfigVars( [
			'wgWandaScribeEnabled' => true
		] );
	}
}
