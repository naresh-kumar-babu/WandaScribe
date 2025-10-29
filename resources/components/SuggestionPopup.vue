<template>
  <div
    v-if="visible"
    class="wandascribe-suggestion-popup"
    :style="positionStyle"
  >
    <div class="wandascribe-suggestion-header">
      <span class="wandascribe-suggestion-title">{{ msg( 'wandascribe-suggestion' ) }}</span>
      <button class="wandascribe-close-btn" @click="dismiss" :aria-label="msg( 'wandascribe-dismiss' )">×</button>
    </div>

    <div class="wandascribe-suggestion-content">
      <div v-if="error" class="wandascribe-error">
        <cdx-message type="error">
          {{ error }}
        </cdx-message>
      </div>

      <div v-else-if="success" class="wandascribe-success">
        <cdx-message type="success">
          {{ success }}
        </cdx-message>
      </div>

      <div v-else-if="suggestion" class="wandascribe-suggestion-text">
        <div class="wandascribe-original">
          <strong>Original:</strong>
          <p>{{ originalText }}</p>
        </div>
        <div class="wandascribe-suggested">
          <strong>Suggested:</strong>
          <p>{{ suggestion }}</p>
        </div>
      </div>

      <div v-if="misspellings && misspellings.length > 0" class="wandascribe-misspellings">
        <strong>Misspelled words:</strong>
        <ul>
          <li v-for="(word, idx) in misspellings" :key="idx">
            <span class="misspelled-word">{{ word.word }}</span>
            <span class="suggestions" v-if="word.suggestions && word.suggestions.length > 0">
              → Suggestions:
              <button
                v-for="(sugg, sIdx) in word.suggestions"
                :key="sIdx"
                class="wandascribe-spelling-suggestion"
                @click="applyIndividualSuggestion(word.word, sugg)"
              >
                {{ sugg }}
              </button>
            </span>
            <span v-else class="no-suggestions">
              (no suggestions)
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="misspellings && misspellings.length > 0" class="wandascribe-suggestion-actions">
      <cdx-button
        action="progressive"
        weight="primary"
        :disabled="!hasApplicableSuggestions"
        @click="applyAllSuggestions"
      >
        {{ msg( 'wandascribe-apply-all' ) }}
      </cdx-button>
      <cdx-button
        action="default"
        weight="quiet"
        @click="dismiss"
      >
        {{ msg( 'wandascribe-dismiss' ) }}
      </cdx-button>
    </div>

    <div v-else-if="suggestion" class="wandascribe-suggestion-actions">
      <cdx-button
        action="progressive"
        weight="primary"
        :disabled="applyDisabled"
        @click="applySuggestion"
      >
        {{ msg( 'wandascribe-apply' ) }}
      </cdx-button>
      <cdx-button
        action="default"
        weight="quiet"
        @click="dismiss"
      >
        {{ msg( 'wandascribe-dismiss' ) }}
      </cdx-button>
    </div>
  </div>
</template>

<script>
const { CdxButton, CdxMessage } = require( '../codex.js' );

module.exports = exports = {
  name: 'SuggestionPopup',
  components: {
    CdxButton,
    CdxMessage
  },
  emits: [ 'apply-suggestion', 'apply-all-suggestions', 'dismissed' ],
  data() {
    return {
      visible: false,
      error: null,
      success: null,
      suggestion: null,
      applyDisabled: false,
      originalText: null,
      misspellings: [],
      position: { top: 0, left: 0 }
    };
  },
  computed: {
    positionStyle() {
      return {
        top: this.position.top + 'px',
        left: this.position.left + 'px'
      };
    },
    hasApplicableSuggestions() {
      return this.misspellings.some( word => 
        word.suggestions && word.suggestions.length > 0 
      );
    }
  },
  mounted() {
    window.addEventListener( 'scroll', this.updatePosition, true );
    window.addEventListener( 'resize', this.updatePosition );
  },
  beforeUnmount() {
    window.removeEventListener( 'scroll', this.updatePosition, true );
    window.removeEventListener( 'resize', this.updatePosition );
  },
  methods: {
    msg( key ) {
      return mw.message( key ).text();
    },
    show( text, position ) {
      this.originalText = text;
      this.position = position;
      this.visible = true;
      this.error = null;
      this.success = null;
      this.suggestion = null;
      this.applyDisabled = false;
      this.misspellings = [];
      this.updatePosition();
    },
    updatePosition() {
      if ( !this.visible ) {
        return;
      }
      this.$nextTick( () => {
        const popup = this.$el;
        if ( !popup ) {
          return;
        }
        
        const rect = popup.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if ( rect.right > viewportWidth ) {
          this.position.left = Math.max( 10, viewportWidth - rect.width - 10 );
        }
        
        if ( rect.bottom > viewportHeight ) {
          this.position.top = Math.max( 10, viewportHeight - rect.height - 10 + window.scrollY );
        }
      } );
    },
    hide() {
      this.visible = false;
    },
    dismiss() {
      this.hide();
      this.$emit( 'dismissed' );
    },
    setError( errorMsg ) {
      this.error = errorMsg;
      this.success = null;
    },
    setSuccess( successMsg ) {
      this.success = successMsg;
      this.error = null;
    },
    setSuggestion( text, disabled = false ) {
      this.suggestion = text;
      this.applyDisabled = disabled;
      this.error = null;
      this.success = null;
    },
    setMisspellings( words ) {
      this.misspellings = words;
    },
    applySuggestion() {
      this.$emit( 'apply-suggestion', this.suggestion, null );
      this.hide();
    },
    applyIndividualSuggestion( originalWord, suggestion ) {
      // Apply individual spelling correction without closing the popup
      this.$emit( 'apply-suggestion', suggestion, originalWord );
      // Remove the corrected word from the misspellings list
      this.misspellings = this.misspellings.filter( word => word.word !== originalWord );
      if ( this.misspellings.length === 0 ) {
        this.setSuccess( this.msg( 'wandascribe-all-corrections-applied' ) );
        setTimeout( () => {
          this.hide();
        }, 1500 );
      }
    },
    applyAllSuggestions() {
      const corrections = [];
      this.misspellings.forEach( word => {
        if ( word.suggestions && word.suggestions.length > 0 ) {
          corrections.push( {
            original: word.word,
            replacement: word.suggestions[ 0 ] // Use first suggestion
          } );
        }
      } );
      
      if ( corrections.length > 0 ) {
        this.$emit( 'apply-all-suggestions', corrections );
        this.hide();
      }
    }
  }
};
</script>
