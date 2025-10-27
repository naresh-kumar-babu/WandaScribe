<template>
  <div class="wandascribe-panel">
    <div class="wandascribe-panel-header">
      <h3>{{ msg( 'wandascribe-panel-title' ) }}</h3>
      <span class="wandascribe-powered-by">{{ msg( 'wandascribe-powered-by-wanda' ) }}</span>
    </div>

    <div class="wandascribe-panel-content">
      <div v-if="!hasSelection" class="wandascribe-hint">
        <cdx-message type="notice">
          {{ msg( 'wandascribe-select-text-hint' ) }}
        </cdx-message>
      </div>

      <div v-if="!wandaAvailable" class="wandascribe-error">
        <cdx-message type="error">
          {{ msg( 'wandascribe-wanda-not-available' ) }}
        </cdx-message>
      </div>

      <div class="wandascribe-actions">
        <cdx-button
          :disabled="!hasSelection || loading"
          @click="performAction('spell-check')"
          weight="quiet"
          action="default"
        >
          <cdx-icon :icon="cdxIconCheck"></cdx-icon>
          {{ msg( 'wandascribe-check-spelling' ) }}
        </cdx-button>

        <cdx-button
          :disabled="!hasSelection || loading"
          @click="performAction('grammar-check')"
          weight="quiet"
          action="default"
        >
          <cdx-icon :icon="cdxIconEdit"></cdx-icon>
          {{ msg( 'wandascribe-check-grammar' ) }}
        </cdx-button>

        <cdx-button
          :disabled="!hasSelection || loading"
          @click="performAction('improve')"
          weight="quiet"
          action="default"
        >
          <cdx-icon :icon="cdxIconHighlight"></cdx-icon>
          {{ msg( 'wandascribe-improve-text' ) }}
        </cdx-button>

        <cdx-button
          :disabled="!hasSelection || loading"
          @click="performAction('formal')"
          weight="quiet"
          action="default"
        >
          <cdx-icon :icon="cdxIconTextStyle"></cdx-icon>
          {{ msg( 'wandascribe-make-formal' ) }}
        </cdx-button>

        <cdx-button
          :disabled="!hasSelection || loading"
          @click="performAction('casual')"
          weight="quiet"
          action="default"
        >
          <cdx-icon :icon="cdxIconTextStyle"></cdx-icon>
          {{ msg( 'wandascribe-make-casual' ) }}
        </cdx-button>

        <cdx-button
          :disabled="!hasSelection || loading"
          @click="performAction('simplify')"
          weight="quiet"
          action="default"
        >
          <cdx-icon :icon="cdxIconTextStyle"></cdx-icon>
          {{ msg( 'wandascribe-simplify' ) }}
        </cdx-button>

        <cdx-button
          :disabled="!hasSelection || loading"
          @click="performAction('expand')"
          weight="quiet"
          action="default"
        >
          <cdx-icon :icon="cdxIconTextStyle"></cdx-icon>
          {{ msg( 'wandascribe-expand' ) }}
        </cdx-button>

        <cdx-button
          :disabled="!hasSelection || loading"
          @click="performAction('summarize')"
          weight="quiet"
          action="default"
        >
          <cdx-icon :icon="cdxIconArticleSearch"></cdx-icon>
          {{ msg( 'wandascribe-summarize' ) }}
        </cdx-button>
      </div>

      <div v-if="loading" class="wandascribe-loading">
        <cdx-progress-bar :value="null" />
        <span>{{ msg( 'wandascribe-loading' ) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
const { CdxButton, CdxProgressBar, CdxMessage, CdxIcon } = require( '../codex.js' );
const icons = require( '../icons.json' );

module.exports = exports = {
  name: 'AssistancePanel',
  components: {
    CdxButton,
    CdxProgressBar,
    CdxMessage,
    CdxIcon
  },
  emits: [ 'action-requested' ],
  data() {
    return {
      hasSelection: false,
      loading: false,
      wandaAvailable: true,
      cdxIconCheck: icons.cdxIconCheck,
      cdxIconEdit: icons.cdxIconEdit,
      cdxIconInfo: icons.cdxIconInfo,
      cdxIconArticleSearch: icons.cdxIconArticleSearch,
      cdxIconHighlight: icons.cdxIconHighlight,
      cdxIconTextStyle: icons.cdxIconTextStyle
    };
  },
  methods: {
    msg( key ) {
      return mw.message( key ).text();
    },
    async performAction( actionType ) {
      this.loading = true;
      this.$emit( 'action-requested', actionType );
    },
    setLoading( isLoading ) {
      this.loading = isLoading;
    },
    setWandaAvailable( available ) {
      this.wandaAvailable = available;
    },
    setHasSelection( hasSelection ) {
      this.hasSelection = hasSelection;
    }
  }
};
</script>
