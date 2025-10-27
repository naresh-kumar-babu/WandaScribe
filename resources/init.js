/**
 * Initialization script for WandaScribe
 * Mounts Vue components and integrates with MediaWiki editor
 */

const Vue = require( 'vue' );
const AssistancePanel = require( './components/AssistancePanel.vue' );
const SuggestionPopup = require( './components/SuggestionPopup.vue' );
const EditorIntegration = require( './editorIntegration.js' );

( function () {
  'use strict';

  // Wait for DOM to be ready
  $( function () {
    // Check if we're on an edit page
    const textarea = document.getElementById( 'wpTextbox1' );
    if ( !textarea ) {
      return;
    }
    // Check if WandaScribe is enabled
    if ( !mw.config.get( 'wgWandaScribeEnabled' ) ) {
      return;
    }

    // Create container for the assistance panel
    const panelContainer = document.createElement( 'div' );
    panelContainer.id = 'wandascribe-panel-container';
    panelContainer.className = 'wandascribe-panel-container';

    // Insert panel directly above the textarea (wpTextbox1)
    textarea.parentNode.insertBefore( panelContainer, textarea );

    // Create container for the suggestion popup
    const popupContainer = document.createElement( 'div' );
    popupContainer.id = 'wandascribe-popup-container';
    document.body.appendChild( popupContainer );

    // Initialize editor integration (pass it before mounting)
    const editorIntegration = new EditorIntegration( textarea );

    // Mount Vue components with event handlers
    const panelApp = Vue.createMwApp( AssistancePanel, {
      onActionRequested: ( actionType ) => {
        editorIntegration.handleAction( actionType );
      }
    } );
    const panelInstance = panelApp.mount( panelContainer );

    const popupApp = Vue.createMwApp( SuggestionPopup, {
      onApplySuggestion: ( suggestion, originalWord ) => {
        editorIntegration.applySuggestion( suggestion, originalWord );
      },
      onDismissed: () => {
        // Popup already hides itself
      }
    } );
    const popupInstance = popupApp.mount( popupContainer );

    // Connect the components to the editor integration
    editorIntegration.setComponents( panelInstance, popupInstance );


    // Add CSS class to body for styling
    document.body.classList.add( 'wandascribe-active' );
  } );
}() );
